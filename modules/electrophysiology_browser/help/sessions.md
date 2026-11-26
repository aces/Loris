# View Session

This page displays information from an individual recording session.

Summary information about the candidate, the recording session and the hardware used is displayed.

Files can be downloaded containing only the recording signal, the events, or other metadata, or all files compressed together, for the current session. These files are organized according to the EEG-BIDS standard (more information on the standard can be found [here](https://www.nature.com/articles/s41597-019-0104-8)), and are available for download as follows:

- All files (tgz): a compressed folder containing all the recording data as well as the metadata for the EEG scan session.
- EEG: the file containing the session recording data.    
- Electrode info (tsv): contains electrode locations.    
- Channels info (tsv): channel status and filter settings.
- Events (tsv): events (both stimuli and responses) recorded during the session.  

___

#### Keyboard Shortcuts Legend

##### ***When cursor is inside signal plot:***

(&uarr;, &larr;): Arrow keys

&larr; / &rarr; : Go backwards/forwards by the value of the time interval  
&uarr; / &darr; : Page channels up/down by number of displayed channels   
Use the Shift key &#8679; in order to :  
(&#8679; +) **+** : Zoom in  
(&#8679; +) **–** : Zoom out  
(&#8679; +) **Z**: Zoom to selected time region  
(&#8679; +) **X**: Reset zoom interval to default  
(&#8679; +) **M**: Increase amplitude  
(&#8679; +) **N**: Decrease amplitude  
(&#8679; +) **E**: Open 'Event Panel'  
(&#8679; +) **A**: Open 'Add Event' panel  
(&#8679; +) **H**: Open 'HED Endorsement' panel  
(&#8679; +) **V**: Show values at cursor (on/off)  
(&#8679; +) **B**: Plot all signals on same axis ('Stacked' on/off)  
(&#8679; +) **S**: 'Isolate' mode - Show one channel at a time (in 'Stacked' view) by hovering on channel name

##### ***HED Endorsement Panel shortcuts***

(&#8679; +) &uarr; / &darr; : Select previous/next HED tag  
(&#8679; +) &larr; / &rarr; : Select and jump to previous/next HED tag  
(&#8679; +) **I**: Scroll to current selection  
(&#8679; +) **J**: Jump to current selection  
(&#8679; +) **K**: Edit current selection's event  
(^ +) **E** : Select 'Endorse' action  
(^ +) **C** : Select 'Caveat' action  
(^ +) **M** : Select 'Comment' action  
(^ +) **Enter** : Submit selected action  
