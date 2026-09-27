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
    let postsReturn= [...posts]
    if(category){
        postsReturn = postsReturn.filter(post => (post.category === category))
    }
    if (take){
        postsReturn = postsReturn.slice(0, take)
    }

    return postsReturn
}

export function getById(id){
    const post = posts.find(post => (post.id== id))
    return post
}

export async function addPost(post) {
    posts = [...posts, post]
    return post
}

