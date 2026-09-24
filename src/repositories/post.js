let posts = [
    {
        id:0,
        title: 'Hello',
        content: 'Hello World',
        author: 'Vika',
        category: 'talking'
    },
    {
        id:1,
        title: 'Cat',
        content: 'Look at my cat!',
        author: 'Polina',
        category: 'cat'
    },
     {
        id:2,
        title: 'One more cat',
        content: 'That is my other cat!',
        author: 'Polina',
        category: 'cat'
    },
]


export function getAll(category, take){
    let postsRes= [...posts]
    
    if(category){
        postsRes = postsRes.filter(product => (product.category === category))
    }
    
    if (take){
        postsRes = postsRes.slice(0, take)
    }

    return postsRes
}

export function getById(id){
    let postsRes= [...posts]
   
    const post = postsRes.find(product => (product.id== id))
    if (!post){
        return 404
    }

    return post
}

export async function addPost(post) {
    posts = [...posts, post]
    return post
}

