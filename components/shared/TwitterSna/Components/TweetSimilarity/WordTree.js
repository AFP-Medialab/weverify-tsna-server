import Chart from "react-google-charts"


export default function WordTree(props) {

  const {data, rootWord} = props;
  let options=null;
  if (rootWord){
    options={
      wordtree: {
        format: "implicit",
        word: rootWord,
        type: 'double',
      },
    }
  }else{
    options={
      wordtree: {
        format: "implicit",
      },
    }
  }
  console.log("data", data);
  return (
    <Chart
      width={"1200px"}
      height={"500px"}
      chartType="WordTree"
      loader={<div>Loading Chart</div>}
      data = {data}
      options={options}
      rootProps={{ "data-testid": "1" }}
    />
  );
}