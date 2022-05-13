module.exports.index = async (req, res) => {
    res.render('form')
}

module.exports.uploadComic = async (req, res) => {
    // console.log(req.body.tag)
    const images = req.files.map(f => ({ filename: f.filename }))
    // console.log(images);
    req.flash('success', 'Successfully uploaded Comic to Cloudinary!');
    res.redirect(`/`)
}