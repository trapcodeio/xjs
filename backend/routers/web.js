const Route = $.router;

Route.path('/upload', ()=>{
    Route.get('', 'getUpload');
    Route.post('', 'postUpload');
}).controller('Upload').actionsAsName().as('upload');
