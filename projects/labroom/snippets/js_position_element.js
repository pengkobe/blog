define(function(require, exports, module) {
    module.exports= function(){
        $('#snippets code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    }
});
