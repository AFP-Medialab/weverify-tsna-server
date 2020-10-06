import {postFetcher} from "../../components/shared/lib/fetch";
import useSWR from 'swr';


function StateNameAN () { 
  let jsonQuery = '{"size": 10, "query": { "bool": { "must": [ { "match": { "full_text": {"query": "fake news"}}},{"range": {"datetimestamp": {"format": "uuuu-MM-dd HH:mm:ss||uuuu-MM-dd||epoch_millis","gte": "2020-06-15 00:00:00","lte": "2020-06-18 00:00:00"}}}],"filter": [],"should": [],"must_not": []}},"sort": [{"datetimestamp": "asc"}]}';
  const { data, error } = useSWR(['/api/getTweets', jsonQuery], postFetcher);
  /* In case API fails */
  if (error) return <div>failed to load</div>  
  
  /* While result API loads */
  if (!data) return <div>loading...</div>  
    
  /* After response from the API is received */
  return (
    <div>
      <h2>Todo List</h2>
   
      <ul>
        {data.hits.hits.map(item => <li key={item._source.id_str}>{item._source.full_text}</li>)}
      </ul>
      
    </div>
  )
} 
  
export default function IndexPage() { 
  return ( 
    <div> 
      <StateNameAN /> 
    </div> 
  ); 
}