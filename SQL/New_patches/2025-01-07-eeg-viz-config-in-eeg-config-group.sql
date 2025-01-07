UPDATE ConfigSettings
SET Parent = (SELECT ID FROM ConfigSettings WHERE Name="eeg_pipeline"),
Label = 'Enable the EEG Browser visualization components'
WHERE Name = 'useEEGBrowserVisualizationComponents';