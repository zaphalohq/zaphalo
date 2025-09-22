import { useContext, useEffect, useState } from "react"
import { TemplateContext } from "@src/modules/whatsapp/Context/TemplateContext";

const TemplateVariables = () => {
  const { templateData, setTemplateData }: any = useContext(TemplateContext)
  const [variables, setVariables] = useState(() => {
    if (templateData.variables?.length > 0) {
      return [...templateData.variables];
    } else {
      return [{ name: '', value: '' }];
    }
  })

  useEffect(() => {
    const variableMatches = templateData.bodyText.match(/{{\d+}}/g) || [];

    const newVariables = variableMatches.map((variableName: string) => {
      const matchedVariable = templateData.variables?.find(
        (v: any) => v.name === variableName
      );

      return {
        name: variableName,
        value: matchedVariable ? matchedVariable.value : '',
      };
    });

    setVariables(newVariables);
  }, [templateData.bodyText]);

  const HandleVariableChange = (event: any, index: number) => {
    const variablesCopy = [...variables]
    const variableObj = variablesCopy[index]
    const variableObjChange = { ...variableObj, [event.target.name]: event.target.value }
    variablesCopy[index] = variableObjChange
    setVariables(variablesCopy)
  }

  useEffect(() => {
    setTemplateData((prev: any) => ({ ...prev, variables: variables }))
    // setTemplateData((prev: any) => ({ ...prev, variables: variables }))
  }, [variables])

  return (
    <div>
      <table className="text-left w-full border border-gray-300">
        <thead className="font-semibold border-b border-gray-300">
          <tr>
            <td className="px-4 py-2">Name</td>
            <td className="px-4 py-2">Sample Value</td>
            <td className="px-4 py-2">Value</td>
          </tr>
        </thead>
        <tbody>
          {variables.map((variable: any, index: number) =>
            <tr key={index} className="border-b border-gray-300">
              <td className="px-4 py-1">Body--{variable.name}</td>
              <td className="px-4 py-1">Yaari{Math.floor(100000 + Math.random() * 900000).toString().slice(0, 3)}</td>
              <td className="px-4 py-1">
                <input onChange={(event: any) => HandleVariableChange(event, index)} value={variables[index]?.value} name="value" type="text" placeholder="enter your value" className="px-2 appearance-none outline-none p-1 border-b border-gray-400  bg-transparent" />
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>
  )
}

export default TemplateVariables
