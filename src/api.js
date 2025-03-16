let req = new Request()
const BASE_URL = "https://gustavofurtad2-tabnews.web.val.run/"

req.followlocation = true
req.headers = ["upgrade-insecure-requests: 1", "sec-fetch-dest: document", "sec-fetch-mode: navigate"]

export function getPosts(page, perPage, strategy) {

    req.asyncGet(`${BASE_URL}content/?page=${page}&per_page=${perPage}&strategy=${strategy}`)

    while(!req.ready(2)) {
        console.log("Waiting... " + req.getAsyncSize() + " bytes transfered");
        System.sleep(1); 
    }
    
    let result = req.getAsyncData()
    
    console.log(result) 
    
    return result
}

export function getPostContent(owner, slug) {

    req.asyncGet(`${BASE_URL}post/?owner=${owner}&slug=${slug}`)

    while(!req.ready(2)) {
        console.log("Waiting... " + req.getAsyncSize() + " bytes transfered");
        System.sleep(1); 
    }
    
    let result = req.getAsyncData()
    
    console.log(result) 
    
    return result
}