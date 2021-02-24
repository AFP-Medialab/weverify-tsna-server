
//const tsv = "http://localhost:8001//components/NavItems/languages.tsv";
const tsv ="https://raw.githubusercontent.com/AFP-Medialab/InVID-Translations/react/components/NavItems/languages.tsv";

export async function getStaticProps() {
    const res = await fetch(tsv);
    const keyword = await res.text();
    console.log("ici ", keyword);
    return {
        props: {
            keyword
        }
    }
}

function TestInclude({keyword}) {
    return (
        <div>{keyword}</div>
    )
}

export default TestInclude;