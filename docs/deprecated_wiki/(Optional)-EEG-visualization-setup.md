EEG visualization components require Protocol Buffers v3.0.0 or higher. 
You can install it with the command `sudo apt install protobuf-compiler`.
For other install options, you can refer to the Protocol Buffers GitHub page: https://github.com/protocolbuffers/protobuf.

To enable the visualization components, set the `useEEGBrowserVisualizationComponents` config (Configuration/GUI) to true and run make dev or npm install && npm run compile from the loris root directory.