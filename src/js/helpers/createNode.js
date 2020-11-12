const createNode = (nodeName, ...classNames) => {
  const node = document.createElement(nodeName);
  node.classList.add(...classNames);
  return node;
};

export default createNode;
