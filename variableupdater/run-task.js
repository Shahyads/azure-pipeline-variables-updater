const tl = require("azure-pipelines-task-lib/task");
const axios = require("axios").default;

async function main()
{
    try
    {		
		console.log('start');
        const token = tl.getEndpointAuthorizationParameter('SystemVssConnection', 'AccessToken', false);
        const groupID = tl.getInput("VariableGroupId", true),
            varName = tl.getInput("VariableName", true),
            newValue = tl.getInput("NewValue", true);
        
		console.log(`VariableGroupId: ${groupID}`);
        console.log(`VariableName: ${varName}`);

        const groupURL = `${process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI}${process.env.SYSTEM_TEAMPROJECTID}/_apis/distributedtask/variablegroups/${groupID}?api-version=4.1-preview.1`;
        const axConf = {headers: {"Authorization": `Bearer ${token}`}};

        const group = (await axios.get(groupURL, axConf)).data,
            vars = group.variables
        const varEntry =  Object.entries(vars).find(([key]) => key.toLowerCase() == varName.toLowerCase());
        if(varEntry)
        {
            if(!varEntry[1].isSecret)
                console.log(`Old value: ${varEntry[1].value}`);
            varEntry[1].value = newValue;
        }
        else
            vars[varName] = {value: newValue};
        console.log(`New value: ${newValue}`);

        try
        {
            await axios.put(groupURL, group, axConf);
        }
        catch(ex)
        {
            if(ex.isAxiosError && ex.response && ex.response.status && ex.response.status == 403) 
            {
                try
                {
                    const taskUser = (await axios.get(`${process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI}_api/_common/GetUserProfile?__v=5`, axConf)).data.identity.DisplayName;
                    tl.setResult(tl.TaskResult.Failed, `"Access denied" during variable group update. The identity "${taskUser}" has no permission for updating the variable group.`, true);
                }
                catch(innerExc)
                {
                    throw ex;
                }
            }
            else
                throw ex;
        }
    }
    catch(ex)
    {
        tl.setResult(tl.TaskResult.Failed, ex.message, true);
        if(ex.stack)
		{
            console.log(ex.stack);
		}
    }
}
main();