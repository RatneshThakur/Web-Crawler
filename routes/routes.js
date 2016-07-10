var appRouter = function(app) {
  app.get("/", function(req,res){
    res.send("Hello world");
  });
}
module.exports = appRouter;
