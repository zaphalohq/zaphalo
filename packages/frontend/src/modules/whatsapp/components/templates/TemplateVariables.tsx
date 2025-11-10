import { useContext, useEffect, useState } from "react"
import { TemplateContext } from "@src/modules/whatsapp/Context/TemplateContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/UI/select";

const TemplateVariables = () => {
  const { templateData, setTemplateData }: any = useContext(TemplateContext)
  const [variables, setVariables] = useState(() => {
    if (templateData.variables?.length > 0) {
      return [...templateData.variables];
    } else {
      return [{ name: '', type: "STATIC", value: '', dynamicField: '', sampleValue: '' }];
    }
  })

  useEffect(() => {
    const variableMatches = templateData?.bodyText?.match(/{{\d+}}/g) || [];

    const newVariables = variableMatches.map((variableName: string) => {
      const matchedVariable = templateData.variables?.find(
        (v: any) => v.name === variableName
      );

      return {
        name: variableName,
        type: matchedVariable?.type || "STATIC",
        value: matchedVariable?.value || "",
        dynamicField: matchedVariable?.dynamicField || "",
        sampleValue:
          matchedVariable?.sampleValue ||
          `Zaphalo${Math.floor(100000 + Math.random() * 900000)
            .toString()
            .slice(0, 3)}`,
      };
    });

    setVariables(newVariables);
  }, [templateData.bodyText]);

  const HandleVariableChange = (event: any, index: number) => {
    const variablesCopy = [...variables]
    const variableObj = variablesCopy[index]
    const variableObjChange = { ...variableObj, [event.target.name]: event.target.value }
    variablesCopy[index] = variableObjChange

    setVariables(variablesCopy);
  }

  const handleTypeChange = (value: string, index: number) => {
    const variablesCopy = [...variables];
    const variableObj = variablesCopy[index];

    if (value === "STATIC") {
      variableObj.type = "STATIC";
      variableObj.value = "";
      variableObj.dynamicField = "";
    } else {
      variableObj.type = "DYNAMIC";
      variableObj.dynamicField = "";
      variableObj.value = "";
    }

    variablesCopy[index] = variableObj;
    setVariables(variablesCopy);
  };

  const handleDynamicFieldChange = (value: string, index: number) => {
    const variablesCopy = [...variables];
    variablesCopy[index] = { ...variablesCopy[index], dynamicField: value };
    setVariables(variablesCopy);
  };

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
            <td className="px-4 py-2">Variable Type</td>
            <td className="px-4 py-2">Value</td>
          </tr>
        </thead>
        <tbody>
          {variables.map((variable: any, index: number) =>
            <tr key={index} className="border-b border-gray-300">
              <td className="px-4 py-1">Body--{variable.name}</td>
              <td className="px-4 py-1">
                <input
                  onChange={(event: any) => HandleVariableChange(event, index)}
                  value={variables[index]?.sampleValue}
                  name="sampleValue"
                  type="text"
                  placeholder="Enter sample value"
                  className="px-2 appearance-none outline-none p-1 border-b border-gray-400 bg-transparent"
                />
              </td>
              <td className="px-4 py-1">
                <Select
                  name="type"
                  value={variable.type}
                  onValueChange={(value) => handleTypeChange(value, index)}
                >
                  <SelectTrigger><SelectValue placeholder="Select Variable Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STATIC">Static</SelectItem>
                    <SelectItem value="DYNAMIC">Dynamic</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="px-4 py-1">
                {variable.type === "STATIC" ? (
                  <input
                    onChange={(event: any) => HandleVariableChange(event, index)}
                    value={variables[index]?.value}
                    name="value"
                    type="text"
                    placeholder="Enter static value"
                    className="px-2 appearance-none outline-none p-1 border-b border-gray-400 bg-transparent"
                  />
                ) : (
                  <Select
                    name="dynamicField"
                    value={variable.dynamicField}
                    onValueChange={(value) => handleDynamicFieldChange(value, index)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Dynamic Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {DYNAMIC_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>
  )
}

export default TemplateVariables


const DYNAMIC_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Phone Number", value: "number" },
  { label: "Email", value: "email" },
  { label: "City", value: "city" },
];