const defaultLeafFunc = (result, node) => {
    result.name = node.name;
};
const defaultParentPostFunc = (result, node) => {
    result.name = node.name;
};
const defaultParentPreFunc = (result, node) => {
    // result.name = node.name;
};
const defaultAddDepth = (result, parentNode, children) => {
    if (!parentNode.hasOwnProperty(children)) {
        result.depth = 0;
    } else {
        result.depth = parentNode.depth + 1;
    }
};

function postOrderTraversal(build, {
    children = 'children',
    leafFunc = defaultLeafFunc,
    parentPostFunc = defaultParentPostFunc,
    parentPreFunc = defaultParentPreFunc,
    addDepth = defaultAddDepth
} = {}) {
    let node = build;
    const result = {};
    const mapResult = [result];
    const stack = [];
    while (node) {
        if (Array.isArray(node[children]) && node[children].length > 0) {
            const result = {children: []};
            addDepth(result, mapResult[0], children);
            parentPreFunc(result, node);
            if (!mapResult[0].hasOwnProperty(children)) {
                Object.assign(mapResult[0], result);
            } else {
                mapResult[0].children.push(result);
                mapResult.unshift(result);
            }
            stack.unshift({node, index: 0});
            node = node.children[0];
        } else {
            const nodeResult = {};
            addDepth(nodeResult, mapResult[0], children);
            leafFunc.apply(null, [nodeResult, node, mapResult[0]]); // leaf-func
            if (!mapResult[0].hasOwnProperty(children)) {
                Object.assign(mapResult[0], nodeResult);
                return result;
            }
            mapResult[0].children.push(nodeResult);
            while (stack[0].index === stack[0].node.children.length - 1) {
                parentPostFunc.apply(null, [mapResult[0], stack[0].node]);
                stack.shift();
                mapResult.shift();
                if (stack.length === 0) {
                    return result;
                }
            }
            node = stack[0].node.children[++stack[0].index];
        }
    }
    return result;
}
module.exports = postOrderTraversal;
module.exports.traversal = postOrderTraversal;
module.exports.defaultLeafFunc = defaultLeafFunc;
module.exports.defaultParentPostFunc = defaultParentPostFunc;
module.exports.defaultParentPreFunc = defaultParentPreFunc;
