This is a fork of [Variable Updater](https://github.com/lanalua/azure-pipeline-variables-updater) by Bruno Grillo
using node implementation from [run-task.js](https://github.com/sevaa/azure-pipeline-variables-updater/blob/master/variableupdater/run-task.js) by Seva Alekseyev 
fixing some issues adding some features.

This extension provides a custom build/release task called "Library Variable Updater" to create or update a variable in a Azure DevOps project level variable group (library).
If the variable is not present in the group, it will be created with the specified value.

Important: Requires 'Allow Scripts to Access OAuth Token' enabled in the agent job additional options and set administrator role to 'Project Collection Build Service' in the variable group.