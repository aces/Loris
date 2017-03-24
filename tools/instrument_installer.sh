#!/bin/bash
#             XX XX                                  XX XX
#            X  X  X             XX XX              X  X  X
#             X   X             X  X  X              X   X
#              X X               X   X                X X
#               X                 X X                  X
#                   XX             X              XX
#                     X                          X
#                      XX  +----------------+  XX
#                          |* Everyone loves|
#                          |instruments. *  |
#                          +----------------+

# This script takes care of inserting a new instrument into a LORIS DB. (See https://github.com/aces/Loris/wiki/Instrument-Insertion)

#   John Saigle made this. 
#   <jsaigle.mcin@gmail.com>
#   GNUv3 Licence.


# Input: name of patch
# Cat the contents of a patch to the command line
print_patch_prompt() {
    echo -en "Would you like to view the patch? (Y/n)\t"
    read ANSWER
    if [ "$ANSWER" == "Y" ] 
    then
        echo -e "\n=Contents"
        cat ../project/tables_sql/$1.sql
    fi
}

print_menu() {
    # Display menu
    echo -e "==== INSTRUMENT INSTALLER ===="
    echo "Please select one of the following options."
    echo -e "\t[1] Create new patch file using generate_tables_sql_and_testnames.php"
    echo -e "\t[2] Run a MySQL patch"
    echo -e "\t[3] Uninstall an instrument"
    echo -e "\t[0] Quit"
    echo -en "Make your choice:\t"
}

get_mysql_credentials() {
    echo -e "\n=Database credentials"
    echo -ne "\tEnter hostname (-h flag):\t"
    read HOST
    echo -ne "\tEnter username (-u flag; admin privileges required):\t"
    read USER
    echo -ne "\tEnter name of database (-A flag):\t"
    read DATABASE
    echo "Thank you."
}

### BEGIN SCRIPT ###

# Check that we're in tools/ dir or die
if [ $PWD != "/var/www/loris/tools" ]
then 
    echo "Please run this from within /var/www/loris/tools."
    exit
fi

while true
# Begin while-true loop
do
    print_menu
    read ANSWER

    case $ANSWER in 
        # Begin case statement based on menu choice
        "1") 
            FILES=()
            FILES=($(ls ../project/instruments/{*.linst,*.class.inc}))
            COUNT=0

            # Print instrument filepaths and convert them to filenames as we go
            echo -e "\n== Instrument Selection"
            echo "Please enter the number of the instrument you're interested in: "
            for i in "${FILES[@]}" 
            do
                FILENAME=$(basename "$i")
                echo -e "\t* [$COUNT] $FILENAME"
                ((COUNT+=1))
            done

            # Get instrument choice from user
            ANSWER=1000
            while [ "$ANSWER" -lt 0 -o "$ANSWER" -gt "${#FILES[@]}" ]
            do
                echo -n "(Number?)     "
                read ANSWER 
                # input validation to check for ints
                if ! [ "$ANSWER" -eq "$ANSWER" ]
                then
                    echo "Please enter an integer"
                    ANSWER=1000
                fi
            done

            # check file type -- stolen from StackOverflow at <http://stackoverflow.com/questions/965053/extract-filename-and-extension-in-bash>
            #TODO: Make this work better for double file extensions i.e. '.class.inc'
            FILENAME=$(basename ${FILES[$ANSWER]})
            EXTENSION="${FILENAME##*.}"
            INSTRUMENT="${FILENAME%.*}"

            # If a linst file, output the contents to php patch-generation script
            # TODO: determine if this workflow is the same for manually-coded files
            if [ "$EXTENSION" == "linst" ]
            then
                echo -e "\n==SQL Patch Generation"
                echo -e "\tGenerating patch file using tools/generate_tables_sql_and_testNames.php..."
                cat ../project/instruments/$INSTRUMENT.linst | php generate_tables_sql_and_testNames.php >/dev/null 2>&1
                if [ -e "../project/tables_sql/$INSTRUMENT.sql" ]
                then
                    echo -e "\tTable created!"
                    echo -e "\tThe new patch is located at ../project/tables_sql/$INSTRUMENT.sql."
                    print_patch_prompt $INSTRUMENT
                fi
                # Choose next action
                echo -e "\n==Database Connection"
                echo "Would you like to apply the new patch <../project/tables_sql/$INSTRUMENT.sql> automatically?"
                echo -en "(Y/n)\t"
                read ANSWER
                if [ "$ANSWER" == "Y" ]
                then
                    # TODO repurpose this into a function
                    # TODO: use history, grep, and awk to suggest credentials to the user 
                    get_mysql_credentials
                    echo "Run the following? --> mysql -h $HOST -u $USER -p $DATABASE < ../project/tables_sql/$INSTRUMENT.sql"
                    echo -ne "\t(Y/n)\t"
                    read ANSWER
                    if [ "$ANSWER" == "Y" ] 
                    then
                        echo "Applying patch..."
                        mysql -h $HOST -u $USER -p $DATABASE < ../project/tables_sql/$INSTRUMENT.sql
                    fi
                fi
            fi
            ;; # end of 'patch creation' choice
        "2") 
            FILES=()
            FILES=($(ls ../project/tables_sql/*.sql))

            # Print patch filepaths and convert them to filenames as we go
            echo -e "\n== Instrument Selection"
            echo "Please select a patch:"
            count=0
            for i in "${FILES[@]}" 
            do
                FILENAME=$(basename "$i")
                echo -e "\t* [$count] $FILENAME"
                ((count+=1))
            done

            # Get instrument choice from user
            ANSWER=1000
            while [ "$ANSWER" -lt 0 -o "$ANSWER" -gt "${#FILES[@]}" ]
            do
                echo -en "(Number?)\t"
                read ANSWER 
                # input validation to check for ints
                if ! [ "$ANSWER" -eq "$ANSWER" ]
                then
                    echo "Please enter an integer"
                    ANSWER=1000
                fi
            done
            FILENAME=$(basename ${FILES[$ANSWER]})
            EXTENSION="${FILENAME##*.}"
            PATCH="${FILENAME%.*}"
            echo "Patch is $PATCH"
            print_patch_prompt $PATCH
            get_mysql_credentials # function that prompts for and stores DB credentials
            echo "Run the following? --> mysql -h $HOST -u $USER -p $DATABASE < ../project/tables_sql/$PATCH.sql"
            echo -ne "\t(Y/n)\t"
            read ANSWER
            if [ "$ANSWER" == "Y" ] 
            then
                echo "Applying patch..."
                mysql -h $HOST -u $USER -p $DATABASE < ../project/tables_sql/$PATCH.sql
                echo "Patch applied!"
            fi
            ;;
        "3")
            echo -e "Please enter the MySQL table name of the instrument you would like to remove: \t"
            # TODO: Change this to output currently installed instruments and allow user to select a number instead of typing
            read TABLE
            echo -e "Generating deletion script..."
            FILEPATH="../project/tables_sql/uninstall_$TABLE.sql"
            if [ -e "$FILEPATH" ]
            then
                rm $FILEPATH # If already exists, delete and start fresh
            fi
            touch $FILEPATH
            echo -e "DELETE FROM flag WHERE Test_name=\"$TABLE\";" >> $FILEPATH
            echo -e "DELETE FROM instrument_subtests WHERE Test_name=\"$TABLE\";" >> $FILEPATH
            echo -e "DELETE FROM test_battery WHERE Test_name=\"$TABLE\";" >> $FILEPATH
            echo -e "DELETE FROM test_names WHERE Test_name=\"$TABLE\";" >> $FILEPATH
            echo -e "DROP TABLE IF EXISTS $TABLE;" >> $FILEPATH
            echo "Patch created. Contents:"
            cat $FILEPATH
            echo "Do you want to execute this patch now? (Maybe make a backup first...)"
            echo -en "(Y/n)\t"
            read ANSWER
            if [ "$ANSWER" == "Y" ] 
            then
                get_mysql_credentials
                echo "Uninstalling instrument..."
                mysql -h $HOST -u $USER -p $DATABASE < $FILEPATH
                rm $FILEPATH
            fi
            ;;
        "0")
            exit;;
    esac # end of executable options
    echo
done # while-true loop ends
        #TODO: Else... what? How does this work for manually coded instruments?

        # output intended changes (patch file)

        # Insert into test_names table 
        # Insert into test_subgroups table 

        # run quickform parser and generate tables sql

        # prompt to run assign missing instruments or fix timepoint date
