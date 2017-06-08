import InputUnknown from "./InputUnknown";
import InputDate from "./InputDate";
import InputSelect from "./InputSelect";
import InputNumeric from "./InputNumeric";
import InputGroup from "./InputGroup";
import InputHeader from "./InputHeader";
import InputLabel from "./InputLabel";

export default class InputUtil {
}
InputUtil.uniqueKey = 0;
InputUtil.generateUniqueKey = function() {
  const i = InputUtil.uniqueKey;
  ++InputUtil.uniqueKey;
  return "wtf" + i;
};
InputUtil.renderInput = function(inputMetadata, altBg) {
  let key = inputMetadata.Name;
  if (key === null || key === undefined) {
    key = inputMetadata.Description;
  }
  if (key === null || key === undefined) {
    key = InputUtil.generateUniqueKey();
  }
  const p = {
    key: key,
    altBg: altBg,
    metadata: inputMetadata
  };
  switch (inputMetadata.Type) {
    case "date":
      return <InputDate {...p}/>;
    case "select":
      return <InputSelect {...p}/>;
    case "numeric":
      return <InputNumeric {...p}/>;
    case "ElementGroup":
      return <InputGroup {...p}/>;
    case "header":
      return <InputHeader {...p}/>;
    case "label":
      return <InputLabel {...p}/>;
    default:
      return <InputUnknown {...p}/>;
  }
};
