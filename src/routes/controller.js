import fetch from "node-fetch";

const healthPing = function (req, res) {
    res.status(200).json({
        "success": true
    });
};


const getPosts = function (req, res) {
    const tags = req.query.tag ? req.query.tag.split(",") : [];
    const sortBy = req.query.sortBy ? req.query.sortBy : "id";
    const direction = req.query.direction ? req.query.direction : "asc";

    // The solution example had more tags than the instructions.
    const tagFilters = ['id', 'author', 'authorId', 'likes', 'popularity', 'reads', 'tags', undefined];
    const sortDirection = ['asc', 'desc', undefined];
    let allPosts = [];

    // Throw error if tags is undefined
    if (tags === undefined) {
        res.status(400).send({
            error: 'Tags parameter is required',
            });      
    }

    // Throw error if sortBy/direction are invalid values
    if (!tagFilters.includes(sortBy)) {
        res.status(400).send({
            error: 'sortBy parameter is invalid',
          });
    }
    if (!sortDirection.includes(direction)) {
        res.status(400).send({
            error: 'direction parameter is invalid',
          });
    }
 
    // If there is multiple tags, get all posts with all tags
  
    if (tags.length > 1) {
        let tagsArray = []
        for (const [key, value] of Object.entries(tags)) {
            tagsArray.push(value);
          }
        
        let queries = tagsArray.map(singleTag => {
             // For every singleTag we will send a seperate get fetch to the API and store the result in the posts array.
            return fetch(`http://hatchways.io/api/assessment/blog/posts?tag=${singleTag}&sortBy=${sortBy}&direction=${direction}`)
            .then(response => response.json())
            .then(data => {
                allPosts.push(data);
            })
            .catch(error => {
                console.log(error);
            });

        });
        let unfilteredPosts = []
        // Once all queries are done, we will loop through the allPosts array and filter out the posts that have the same id. 
        Promise.all(queries).then(() => {
            allPosts.forEach(post => {
                unfilteredPosts.push(post.posts);
            });
            // We then remove duplicates from the array.
            let filteredPosts = unfilteredPosts.flat().filter((post, index, self) =>
                index === self.findIndex((elm) => (
                    elm.id === post.id
                ))
            );

            // if sortBy is true, sort the posts by ascending order. if direction = desc, sort by descending order.
            if (sortBy) {
                if (direction === 'desc') {
                    filteredPosts.sort((a, b) => b[sortBy] - a[sortBy]);
                } else {
                    filteredPosts.sort((a, b) => a[sortBy] - b[sortBy]);
                }
            }
            res.status(200).json({
                posts: filteredPosts
            });
        });

    } else {
        // if there is only one tag we will use the following
        fetch(`http://hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`)
        .then(response => response.json())
        .then(data => {

           return data.posts
        }).then(posts => {
            if (sortBy) {
                if (direction === 'desc') {
                    posts.sort((a, b) => b[sortBy] - a[sortBy]);
                } else {
                    posts.sort((a, b) => a[sortBy] - b[sortBy]);
                }
            }
            res.status(200).json({
                posts: posts
            });

        })
        .catch(error => {
            console.log(error);
        });
    }
};





export {
    healthPing,
    getPosts
};

