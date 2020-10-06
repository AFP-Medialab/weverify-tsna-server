import fetcher from "../../components/shared/lib/fetch";
import useSWR from 'swr';

const TestSWR = () => {
    const { data } = useSWR('/api/data', fetcher);
    if (!data) return <h1>loading...</h1>
    return (
        <div>
          <h2>Todo List</h2>
       
          <ul>
            {data.hits.hits.map(item => <li key={item._source.id_str}>{item._source.full_text}</li>)}
          </ul>
          
        </div>
      )
    }
export default TestSWR;