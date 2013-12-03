#!/usr/bin/perl

##############################################################################
#                                                                            #
# CBRAIN Project Perl API
#                                                                            #
##############################################################################
#                                                                            #
#                       CONFIDENTIAL & PROPRIETARY                           #
#       Nothing herein is to be disclosed in any way without the prior       #
#              express written permission of Pierre Rioux                    #
#                                                                            #
#                Copyright 2008 MNI, All rights reserved.                    #
#                                                                            #
##############################################################################

require 5.005;
use strict;
use warnings;

package CbrainAPI;

use LWP::UserAgent;
use HTTP::Cookies;
use URI::Escape;
use XML::Simple;

our $VERSION = "1.0";
sub Version { $VERSION ; }



=head1 NAME

CbrainAPI - API for accessing CBRAIN portal servers

=head1 SYNOPSIS

  use CbrainAPI;
  print "This is CbrainAPI-$CbrainAPI::VERSION\n";

=head1 DESCRIPTION

The CbrainAPI.pm module is a perl class that provides a simple
user agent for connecting to CBRAIN portal servers.

=head1 SIMPLE USAGE

  use CbrainAPI;

  # Create our API user agent
  my $agent = CbrainAPI->new( 
     cbrain_server_url => "https://example.com:abcd/",
  );

  # Login
  $agent->login("username","my*Pass*Word");

  # Register a file named 'abcd.txt' as a CBRAIN 'TextFile',
  # which happens to be visible on CBRAIN SshDataProvider #6 .
  # This assumes the files is there, and the DP is online
  # and accessible to the current user.
  $agent->register_file('abcd.txt', 'TextFile', 6);

=head1 METHODS



=cut
#########################################
=head2 Lifecycle methods
=cut
#########################################

=over

=item new()

Creates a new CBRAIN user agent. Arguments are key/value
pairs, or a hash of such pairs.

Required options:

=over 

=item cbrain_server_url

prefix to the server's web site, as in "http://hostname[:port]/".

=back

Other options:

=over

=item cookie_store_file

a text file where cookies will be stored. By
default, the module will save them in a temporary file in /tmp.

=back

Example:

  my $agent = CbrainAPI->new(
    cbrain_server_url => 'http://example.com:3000/',
    cookie_store_file => "$HOME/my_persistent_store.txt",
  );

=back

=cut
sub new {
  my $self  = shift      || __PACKAGE__;
  my $class = ref($self) || $self;

  my $options  = (@_ == 1 && ref($_[0]) eq 'HASH') ? shift : { @_ };

  my $cookie_store = $options->{'cookie_store_file'} || "/tmp/cbrain_api_cookiejar.$$.txt";
  my $server_url   = $options->{'cbrain_server_url'} || die "Need to be provided with 'cbrain_server_url'.\n";
  $server_url =~ s#/*$#/#;

  my $session = {
     'ua'                   => undef,
     'auth_token'           => undef,
     'user'                 => undef,
     'cookie_store_file'    => $cookie_store,
     'cbrain_server_url'    => $server_url,
     '_cur_req'             => undef,
     'cbrain_error_message' => "",
     'cbrain_success'       => 0,
  };
  bless($session,$class);
  return $session;
}

sub DESTROY {
  my $self = shift || {};
  unlink $self->{'cookie_store_file'};
}



#########################################
=head2 Main API methods
=cut
#########################################

=over

=item login()

Connects to the server, supplies the credentials
and maintains the tokens necessary for the session.

Example:

  $agent->login('jack', '&jill');

=cut
sub login {
  my $self  = shift;
  my $class = ref($self) || die "This is an instance method.\n";

  my $user  = shift || die "Need to be provided with a username.\n";
  my $pw    = shift || die "Need to be provided with a password.\n";

  $self->reset_status();

  # Create the user agent object
  my $ua           = $self->{'ua'} = LWP::UserAgent->new();
  my $agent_string = "CbrainPerlAPI/$VERSION";

  my $os_name  =  `uname -s 2>/dev/null`;
  $os_name     =~ s/^\s*//; $os_name =~ s/\s*$//;
  $os_name     =  "UnknownOS"   if $os_name =~ /^\s*$/;

  my $rev_name =  `uname -r 2>/dev/null`;
  $rev_name    =~ s/^\s*//; $rev_name =~ s/\s*$//;
  $rev_name    =  "UnknownRev"  if $rev_name =~ /^\s*$/;
  $ua->agent("CbrainPerlAPI/$VERSION $os_name/$rev_name");
  $ua->cookie_jar(HTTP::Cookies->new(file => $self->{'cookie_store_file'}, autosave => 1));
  
  # Login to CBRAIN
  my $logreq  = $self->prep_req(GET => "/session/new");
  $self->{'raw_reply'} = $ua->request($logreq);
  unless ($self->{'raw_reply'}->is_success) {
    $self->{'cbrain_error_message'} = "Cannot connect to server: " . $self->{'raw_reply'}->status_line;
    return undef;
  }

  # Extract token
  my $logform_content = $self->{'raw_reply'}->content();
  my $auth_token = $1 if $logform_content =~ m#<authenticity_token>(.+)</authenticity_token>#;
  if (!defined($auth_token) || $auth_token eq "") {
    $self->{'cbrain_error_message'} = "Cannot obtain authentication token?!? Server response:\n$logform_content";
    return undef;
  }
  $self->{'auth_token'} = $auth_token;

  # Post login/password
  $logreq = $self->prep_req(POST => "/session");
  $self->content_uri_escape_params(
      login              => $user,
      password           => $pw
  );
  #$logreq->content_type('application/json');
  #$logreq->content("{ authenticity_token: \"$auth_token\", login: \"$user\", password: \"$pw\" }");
  $self->{'raw_reply'} = $ua->request($logreq);
  unless ($self->{'raw_reply'}->is_success) {
    $self->{'cbrain_error_message'} = "Cannot login: "  . $self->{'raw_reply'}->status_line;
    return undef;
  }
  $self->{'user'} = $user;
  $self->{'cbrain_success'} = 1;
  return 1;
}



=item register_file()

Registers a file with CBRAIN.

  my $userfile_id = register_file($basename, $cbraintype, $data_provider_id);

The file is provided as a plain
I<basename>, and must already exist on a filesystem mounted
by a CBRAIN browsable DataProvider (whose ID is given in
the argument I<data_provider_id>. The I<cbraintype> must
be a string matching one of the predefined CBRAIN userfile
types.

Example:

  $agent->register_file( "abcd.mnc",   "MincFile", 9 );
  $agent->register_file( "lotsa_minc", "MincCollection", 9 );

The method returns the ID of the newly registered file.
=cut
sub register_file {
  my $self  = shift;
  my $class = ref($self) || die "This is an instance method.\n";

  my $basename  = shift || die "Need to be provided with a basename.\n";
  my $basetype  = shift || die "Need to be provided with a filetype.\n";
  my $dp_id     = shift || die "Need to be provided with a data provider_id.\n";

  $self->reset_status();

  my $ua = $self->{'ua'};
  unless ($ua) {
    $self->{'cbrain_error_message'} = "Not logged in.";
    return undef;
  }

  my $req = $self->prep_req(POST => "/data_providers/$dp_id/register");
  $self->content_uri_escape_params(
    'filetypes[]' => "$basetype-$basename",
    'basenames[]' => $basename,
    'commit'      => 'Register files',
  );

  $self->{'raw_reply'} = $ua->request($req);
  unless ($self->{'raw_reply'}->is_success) {
    $self->{'cbrain_error_message'} = "Cannot register: " . $self->{'raw_reply'}->status_line;
    return undef;
  }

  my $content = $self->{'raw_reply'}->content(); # XML rep of the new userfile
  my ($id) = ($content =~ m#(\d+)</id>#i);
  unless (defined($id) && $id =~ /^\d+$/ && $id > 0) {
    $self->{'cbrain_error_message'} = "Cannot parse ID userfile XML reply.";
    return undef;
  }
  $self->{'cbrain_success'} = 1;
  return $id;
}



=item show_userfile()

Fetch the userfile structure associated with a userfile ID. The
result is a hash table created by XML::Simple to represent
the structure.

Example:

  my $tinfo = $session->show_userfile(1234);
  print "Filename: ", $tinfo->{'name'}, "\n";

=cut
sub show_userfile {
  my $self  = shift;
  my $class = ref($self) || die "This is an instance method.\n";

  my $userfile_id = shift || die "Need a userfile ID.\n";

  $self->reset_status();

  my $ua = $self->{'ua'};
  unless ($ua) {
    $self->{'cbrain_error_message'} = "Not logged in.";
    return undef;
  }

  my $req = $self->prep_req(GET => "/userfiles/$userfile_id");

  $self->{'raw_reply'} = $ua->request($req);
  unless ($self->{'raw_reply'}->is_success) {
    $self->{'cbrain_error_message'} = "Cannot get userfile: " . $self->{'raw_reply'}->status_line;
    return undef;
  }

  # Parse XML
  my $xml = $self->{'raw_reply'}->content();
  #$xml =~ s#<(/?)(\d+)#<${1}I$2#g;  # Turn invalid <0> into <I0> etc
  my $parsed = eval { XMLin($xml) };
  if ($@) {
    $self->{'cbrain_error_message'} = "Cannot parse XML for userfile: $@";
    return undef;
  }

  return $parsed;
}



=item create_task()

Creates a new CbrainTask.

  my $task_id = $session->create_task($file_ids, $tool_config_id, $task_attrs, $task_params);

I<file_ids> is the ID of a userfile (or an
array of such) for the task's B<:interface_userfile_ids> (as in Ruby),
exactly as if they had been selected using the interface.

I<tool_config_id> is
the ID of a registered tool_config in CBRAIN, which internally specifies
both the type of the task and the execution server where it will be launched.

I<task_attrs> is a hash with the attributes for the task's model, none of them
mandatory in this API.

I<task_params> is a hash with the params specific to the chosen tool.
The usual Rails convention for encoding complex structures apply:

  task_params = {
    "outfilename"    => "myout.txt",
    "somearray[]"    => [ '1', '2' ],
    "substruct[key1] => "val1",
    "substruct[key2] => "val2",
  }

Example:

  # On files 123 and 212, run the program defined
  # by tool_config #45.
  $tid = $session->create_task( [ 123, 212 ], 45,
          { description => 'MyTask' },
          { gravity     => 42 }
         );

The method returns an array of the newly created task IDs
(because a single 'task create' can in fact trigger the
creation of several tasks, on the CBRAIN side).
=cut
sub create_task {
  my $self  = shift;
  my $class = ref($self) || die "This is an instance method.\n";

  my $file_ids       = shift || die "Need one or several file IDs.\n";
  my $tool_config_id = shift || die "Need a CBRAIN tool_config ID.\n";
  my $task_attrs     = shift || {};
  my $task_params    = shift || {};
  $file_ids = [ $file_ids ] unless ref($file_ids) eq "ARRAY";

  $self->reset_status();

  my $ua = $self->{'ua'};
  unless ($ua) {
    $self->{'cbrain_error_message'} = "Not logged in.";
    return undef;
  }

  $task_attrs->{'tool_config_id'} = $tool_config_id;

  my $req = $self->prep_req(POST => "/tasks");

  # Task attributes
  foreach my $key qw( user_id group_id description tool_config_id ) {
    my $val = $task_attrs->{$key};
    next unless defined $val;
    $self->content_uri_escape_params( "cbrain_task[$key]" => $val );
  }

  # Task params: IDs
  $self->content_uri_escape_params( "cbrain_task[params][interface_userfile_ids][]" => $file_ids );

  # Task params: all others
  foreach my $key (keys %$task_params) {
    my $val      = $task_params->{$key};
    my $spec_key = $key;
    $spec_key =~ s/^(\w+)/[$1]/; # transforms "outfile" into "[outfile]" and "abc[]" into "[abc][]" etc
    $self->content_uri_escape_params( "cbrain_task[params]$spec_key" => $val );
  }

  $self->{'raw_reply'} = $ua->request($req);
  unless ($self->{'raw_reply'}->is_success) {
    $self->{'cbrain_error_message'} = "Cannot create task: " . $self->{'raw_reply'}->status_line;
    return undef;
  }

  my $content = $self->{'raw_reply'}->content(); # XML rep of the new task
  my $ids = [];
  while ($content =~ m#(\d+)</id>#ig) {
    push(@$ids,$1);
  }
  unless (@$ids > 0) {
    $self->{'cbrain_error_message'} = "Cannot parse IDs from XML tasklist reply.";
    print $content;
    return undef;
  }
  $self->{'cbrain_success'} = 1;
  return $ids;
}



=item create_civet_task_for_collection()

Creates a CIVET task.

  my $tid = $session->create_civet_task_for_collection($tool_config_id, $description, $collection_id, $prefix, $minc2dsid, $sci_param);

This is a more specific version of create_task(), used to launch
CIVET jobs. I<tool_config_id> is just like in create_task() but
should really be associated with the CIVET tool.

I<description> is an optional string.

I<collection_id> must be the ID of a CBRAIN-registered FileCollection.

I<prefix> is the CIVET identifier prefix.

I<minc2dsid> must be a reference to a hash that associates the
basenames of the mincfiles found in the FileCollection to
the subject ID to use for each of those basenames. For
instance:

  { 
    'abcd_23.mnc' => 'john',
    'def_1211.mnc.gz' => 'subject21',
  }

I<sci_params> are the CIVET scientific parameters. Defaults are
built-in into this API, but can be overridden selectively by
providing them in this hash. The defaults are:

  {
    model             => "icbm152nl",
    template          => "1.00",
    interp            => "trilinear",
    N3_distance       => "50",
    lsq               => "9",
    no_surfaces       => "0",
    thickness_method  => "tlink",
    thickness_kernel  => "20",
    resample_surfaces => "0",
    combine_surfaces  => "0",
    VBM               => "0",
    VBM_fwhm          => '8',
    VBM_symmetry      => "0",
    VBM_cerebellum    => "1",
    output_filename_pattern => '{subject}-{cluster}-{task_id}-{run_number}',
  }

=cut
sub create_civet_task_for_collection {
  my $self  = shift;
  my $class = ref($self) || die "This is an instance method.\n";

  my $tool_config_id    = shift || die "Need a tool_config ID.\n";
  my $description       = shift || "";
  
  my $col_id            = shift || die "Need a collection ID.\n";
  my $prefix            = shift || die "Need a prefix name.\n";
  my $mincfiles_to_dsid = shift || die "Need hash providing subject IDs for each minc basenames.\n";
  my $sci_params        = shift || {};

  my $attrs  = {};

  # Prepare task attributes
  $description =~ s/\s*$/\n\n/ if $description;
  $description .= "Launched from " . __PACKAGE__ ." version $CbrainAPI::VERSION";
  $attrs->{'description'} = $description;

  # Prepare CIVET parameters
  my $params = {
    model             => "icbm152nl",
    template          => "1.00",
    interp            => "trilinear",
    N3_distance       => "50",
    lsq               => "9",
    no_surfaces       => "0",
    thickness_method  => "tlink",
    thickness_kernel  => "20",
    resample_surfaces => "0",
    combine_surfaces  => "0",
    VBM               => "0",
    VBM_fwhm          => '8',
    VBM_symmetry      => "0",
    VBM_cerebellum    => "1",

    output_filename_pattern => '{subject}-{cluster}-{task_id}-{run_number}',
  };

  foreach my $key (keys %$params) {
    $params->{$key} = $sci_params->{$key} if exists $sci_params->{$key};
  }

  $params->{'collection_id'} = $col_id;

  my $cnt = 0;
  foreach my $basename (keys %$mincfiles_to_dsid) {
    my $dsid = $mincfiles_to_dsid->{$basename};
    $params->{"file_args[$cnt][t1_name]"} = $basename;
    $params->{"file_args[$cnt][dsid]"}    = $dsid;
    $params->{"file_args[$cnt][prefix]"}  = $prefix;
    $params->{"file_args[$cnt][launch]"}  = "1";
    $params->{"file_args[$cnt][pd_name]"} = "";
    $params->{"file_args[$cnt][mk_name]"} = "";
    $cnt++;
  }

  # Create CIVET task
  return $self->create_task( [ $col_id ], $tool_config_id, $attrs, $params );
}



=item show_task()

Fetch the task structure associated with a task ID. The
result is a hash table created by XML::Simple to represent
the structure.

Example:

  my $tinfo = $session->show_task(1234);
  print "Status: ", $tinfo->{'status'}, "\n";

=cut
sub show_task {
  my $self  = shift;
  my $class = ref($self) || die "This is an instance method.\n";

  my $tid   = shift || die "Need a task ID.\n";

  $self->reset_status();

  my $ua = $self->{'ua'};
  unless ($ua) {
    $self->{'cbrain_error_message'} = "Not logged in.";
    return undef;
  }

  my $req = $self->prep_req(GET => "/tasks/$tid");

  $self->{'raw_reply'} = $ua->request($req);
  unless ($self->{'raw_reply'}->is_success) {
    $self->{'cbrain_error_message'} = "Cannot get task: " . $self->{'raw_reply'}->status_line;
    return undef;
  }

  # Parse XML
  my $xml = $self->{'raw_reply'}->content();
  $xml =~ s#<(/?)(\d+)#<${1}I$2#g;  # Turn invalid <0> into <I0> etc
  my $parsed = eval { XMLin($xml) };
  if ($@) {
    $self->{'cbrain_error_message'} = "Cannot parse XML for task: $@";
    return undef;
  }

  return $parsed;
}


  
=back
=cut

#########################################
=head2 Status Methods
=cut
#########################################

=over

=item cbrain_success()

Returns true if the last operation succeeded.

=cut
sub cbrain_success {
  my $self  = shift;
  my $class = ref($self) || die "This is an instance method.\n";
  $self->{'cbrain_success'};
}

=item error_message()

Returns an informative error message about
the last operation that failed.

=cut
sub error_message {
  my $self  = shift;
  my $class = ref($self) || die "This is an instance method.\n";
  $self->{'cbrain_error_message'};
}

=item reset_status()

Resets the internal values for the two API status
fields, the cbrain_error_message() and the 'cbrain_success'.
This method is mostly called internally by other methods
that do interesting stuff.

=cut
sub reset_status {
  my $self  = shift;
  my $class = ref($self) || die "This is an instance method.\n";

  $self->{'cbrain_success'} = 0;
  $self->{'error_message'}  = "";
  $self->{'raw_reply'}      = undef;
}

=back

=cut

#########################################
# Internal methods
#########################################

sub prep_req {
  my $self  = shift;
  my $class = ref($self) || die "This is an instance method.\n";

  my $action = shift || die "Need HTTP method (POST, GET, etc).\n";
  my $path   = shift || die "Need CBRAIN route.\n";

  my $url = $self->{'cbrain_server_url'}; # contains trailing /

  $path =~ s#^/*##;
  $path = "$url$path"; # slash is inside $url
  
  my $req = $self->{'_cur_req'} = HTTP::Request->new($action => $path);
  $req->header('Accept' => 'text/xml');
  $req;
}

sub content_uri_escape_params {
  my $self  = shift;
  my $class = ref($self) || die "This is an instance method.\n";
  my $hash  = (@_ == 1 && ref($_[0]) eq 'HASH') ? shift : { @_ };

  my $req = $self->{'_cur_req'} || die "No request prepared?!?";
  $req->content_type('application/x-www-form-urlencoded') unless $req->content_type();

  my $auth_token = $self->{'auth_token'} || die "Not logged in.";

  my $res  = $req->content() || "";
  $res    .= "authenticity_token=" . uri_escape($auth_token) if $res eq "";
  foreach my $key (sort keys %$hash) {
    my $u_key = uri_escape($key);
    my $o_val = $hash->{$key};
    my $a_val = ref($o_val) eq "ARRAY" ? $o_val : [ $o_val ];
    foreach my $val (@$a_val) {
      my $u_val = uri_escape($val);
      $res .= "&" if $res ne "";
      $res .= "$u_key=$u_val";
    }
  }
  $req->content($res);
  $res;
}

=head1 AUTHOR

Pierre Rioux, CBRAIN project, August 2011

=cut

1;

