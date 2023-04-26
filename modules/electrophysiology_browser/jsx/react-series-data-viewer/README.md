# EEG Browser Visualization

## Installation requirements

The visualization components require Protocol Buffers v3.0.0 or higher.
For install instructions, you can refer to the Protocol Buffers GitHub page: https://github.com/protocolbuffers/protobuf

To enable the visualization components, set the `useEEGBrowserVisualizationComponents` config (Configuration/GUI) to true and run `make dev` or `npm install && npm run compile` from the loris root directory.


## Main dependencies
- [Ramda](https://ramdajs.com)
A practical functional library for JavaScript programmers.

- [Redux](https://redux.js.org):
A Predictable State Container for JS Apps

- [Visx](https://airbnb.io/visx):
A collection of expressive, low-level visualization primitives for React.

- [RxJS](https://rxjs-dev.firebaseapp.com/guide/overview):
RxJS is a library for composing asynchronous and event-based programs by using observable sequences. 
It provides one core type, the Observable, satellite types (Observer, Schedulers, Subjects) and operators to allow handling asynchronous events as collections.

- [TypeScript](https://www.typescriptlang.org)
A static type checker for javascript.

- [Protocol Buffers](https://developers.google.com/protocol-buffers)
To install the Protocol Buffers Compiler (protoc), run:
`apt install -y protobuf-compiler`


## <a name="user-manual"></a> User manual

The EEG Browser visualization component adds support for some useful visual helpers: The **Signal Viewer** and the **Electrode Map**.

![Overall View](https://images.loris.ca/eeg-browser/overall-view.png)

### Signal Viewer
![Signal Viewer](https://images.loris.ca/eeg-browser/signal-values-details.png) <br/><br/>
Several tools can be used to navigate through the Signal Viewer:
 - The **Zoom Controls** (1) can be used to increase or reduce the time interval while maintaining the same midpoint.
   - *Reset*: Set 'zoom' level to default value (5 second interval).
   - *+ / -*: Zoom in or out, respectively.
   - *Region*: This button becomes available when a region is highlighted on the plot (left-click drag). Pressing it sets the time interval to the selected region.
 - The **Timeline Range View** (2) can be used to change the boundaries of the viewed timeline.
   - *[<] / [>]*: These arrows translate the interval bounds backwards or forwards, respectively, by 1 second.
   - *[<<] / [>>]*: These arrows translate the interval bounds backwards or forwards, respectively, by the value of the interval.
   - *Text fields*: The text fields can be edited to manually set the interval.
   - *Sliders*: The sliders can be dragged as an alternative way to set the interval range.
 - The **Amplitude** and **Filter** tools and the **Show/Hide Overflow** button (3) can be used to increase/reduce the amplitude scale, apply high or low-pass filters, or toggle the visibility of signal spillage, respectively.
 - The **Channel Navigation** (4) toolbar can be used to navigate through the viewed channels.
   - *Dropdown*: This dropdown allow to change the number of displayed channels. Currently supported values are: 4, 8 16, 32 or 64 visible channels.
   - *Text field*: This can be used to manually set the starting index of the displayed channels.
   - *[<] / [>]*: These arrows translate the visible channel range backwards or forwards, respectively, by 1 channel.
   - *[<<] / [>>]*: These arrows translate the visible channel range backwards or forwards, respectively, by the number of displayed channel.
 - The **Channel Adjustment** (5) buttons can be used to vertically adjust the position of the signals.
   - *DC/NO Offset*: This button toggles the subtraction of DC offset from the signals, used to center them with respect to their assigned row.
   - *Stack/Spread*: This button toggles the channels from being in their assigned row to being all stacked on the same row. [[Stacked View Demo](#stacked-view)]
 - The **Event Panel** (6) can be used to display information about the events when event data is available.
   - If the selected timeline range contains more than 500 events, a message inside the panel indicates the user to reduce the boundaries of the timeline in order to display the event data.
<br/><br/>
<p style="text-align: center;">
  <img width src="https://images.loris.ca/eeg-browser/signal-values.png"/><br/>
  <sub>Signal Viewer with hovered signal value and event data displayed.</sub>
</p>


### Stacked View
Hovering channel names while in 'stacked' or 'spread (default)' view will thicken the respective signal(s). While in stacked view, a feature called "Isolate" becomes available. [[Isolate Mode Demo](#isolate-mode)]
<br/><br/>![Stacked View](https://images.loris.ca/eeg-browser/signal-stacked.png) <br/>


### Isolate Mode
Hovering channel names while in 'isolate' mode will make that signal the only visible signal on the plot.
<br/><br/>![Isolate Mode](https://images.loris.ca/eeg-browser/signal-isolated.png) <br/>


### Electrode Map 
The current implementation of the Electrode Map supports 2 display modes: 2D and 3D.

| 2D View | 3D View |
|:-------------------------:|:-------------------------:|
|<img width="300" src="https://images.loris.ca/eeg-browser/electrodes-2d-hover.png"/><br/> The 2D view is a stereographic projection of the electrodes position. Electrodes are indexed and their name is 
displayed on mouse hover.  | <img width="300" src="https://images.loris.ca/eeg-browser/electrodes-3d.png" /><br/> The 3D view displays the exact position of the electrodes on the brain. |


### Future developements to come
A signal annotation feature is currently under development.


