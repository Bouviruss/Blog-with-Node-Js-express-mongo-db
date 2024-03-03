const express = require("express");
const router = express.Router();
const Post = require('../models/Post');

/* GET Home */

router.get("", async (req, res) => {

try {
    const locals = {
        title: "Node js Blog",
        description: "Simple blog with ExpressJs and MongoDB.."
    }

    let perPage = 6;
    let page = req.query.page || 1;
    
// Classification and Sorting

    const data = await Post.aggregate([{ $sort: {createdAt: -1}}])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
        locals, 
        data,
        current: page, 
        nextPage: hasNextPage ? nextPage : null
    });


} catch (error) {
    console.log(error);
}

});

/* GET Post ID*/

router.get("/post/:id", async (req, res) => {
    
    try {

        let slug = req.params.id;
        
        const data = await Post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "simple Blog description"
        }
        res.render('post', {locals, data});

    } catch (error) { 
        console.log(error);
    }
    
    });

/* POST SEARCH SearchTerm*/

router.post("/search", async (req, res) => {
    try {
        
        const locals = {
            title: "Search",
            description: "search"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        const data = await Post.find({
            $or: [
                {title: { $regex: new RegExp(searchNoSpecChar, 'i') }},
                {body: { $regex: new RegExp(searchNoSpecChar, 'i') }}
            ]
        });
        res.render("search", {
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
    
    });

// Router to  ABOUT


router.get("/about", (req, res) => {
        res.render("about");
});



router.get("/contact", (req, res) => {
    res.render("contact");
});

















// TEST create a POST


// router.get("", async (req, res) => {
//     const locals = {
//         title: "Node js Blog",
//         description: "Simple blog with ExpressJs and MongoDB.."
//     }
    
//     try {
//         const data = await Post.find();
//         res.render('index', {locals, data});
//     } catch (error) {
//         console.log(error);
//     }
    
//     });


// function insertPostData () {
//     Post.insertMany([
//     {
//         title: "how to create a blog post",
//         body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
//     },
//     {
//        title: "loremp  article description",
//        body: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here body text here description here"
//     },
//     {
//        title: "Why do we use it",
//        body: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here"  
//    },
//    {
//        title: "how to create a server",
//        body: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here"
//    },
//    ])
// }

// insertPostData();



module.exports = router;