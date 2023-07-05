export function createGraphWhenClickANode(e) {
  let selectedNode = e.data.node;

  let neighborNodes = e.data.renderer.graph.adjacentNodes(selectedNode.id);
  let neighborEdges = e.data.renderer.graph.adjacentEdges(selectedNode.id);

  let neighborNodeIds = neighborNodes.map((node) => {
    return node.id;
  });
  neighborNodeIds.push(selectedNode.id);
  let neighborEdgeIds = neighborEdges.map((edge) => {
    return edge.id;
  });

  let clonedNodes = JSON.parse(JSON.stringify(e.data.renderer.graph.nodes()));
  let clonedEdges = JSON.parse(JSON.stringify(e.data.renderer.graph.edges()));

  let updatedNodes = clonedNodes.map((node) => {
    if (!neighborNodeIds.includes(node.id)) {
      node.color = "#C0C0C0";
    }
    return node;
  });

  let updatedEdges = clonedEdges.map((edge) => {
    if (neighborEdgeIds.includes(edge.id)) {
      edge.color = "#000000";
    } else {
      edge.color = "#C0C0C0";
    }
    return edge;
  });

  let newGraph = {
    nodes: updatedNodes,
    edges: updatedEdges,
  };

  return newGraph;
}
