import fetch from 'isomorphic-unfetch'

export default async function fetcher(...args) {
    console.log("args " + args)
  const res = await fetch(...args)
  return res.json()
};

export async function postFetcher(...args){
   
    const response = await fetch(args[0], {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: args[1]
    });
    const res =  await response.json();
    return res;
};