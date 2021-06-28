
$.fn.tree.defaults.loadFilter = function(data, parent) {
    var options = $(this).data().tree.options;
    var idField = options.idField || 'id',
        textField = options.textField || 'text',
        iconField = options.iconField || 'iconCls',
        attributes = options.attributes || [];
 
    var transform = function(node) {
        if (!node['id'] && node[idField]) 
            node['id'] = node[idField];
        if (!node['text'] && node[textField]) 
            node['text'] = node[textField];
        if (!node['iconCls'] && node[iconField]) 
            node['iconCls'] = node[iconField];
    
        if (attributes && $.isArray(attributes)) {
            if (!node['attributes']) {
                node['attributes'] = {};
            }
 
            for (var i = 0; i < attributes.length; i++) {
                node['attributes'][attributes[i]] = node[attributes[i]];
            }
        }
 
        if (node['children']) {
            for (var i = 0; i < node['children'].length; i++) {
                transform(node['children'][i]);
            }
        }
    }
 
    for (var i = 0; i < data.length; i++) {
        transform(data[i]);
    }
 
    return data;
}
 
$.fn.combotree.defaults.loadFilter = $.fn.tree.defaults.loadFilter;