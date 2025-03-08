def dijkstras_algorithm(graph_two, move_this, end_node):
    distances = {node: float('inf') for node in graph_node}
    distances[start_node] = 0
    
    while distances[end_node] == float('inf') and any(end_node in graph_node[intermediate_node] for intermediate_node in graph_node if distances[intermediate_node] < float('inf')):
        current_node = min([potential_next_node for potential_next_node in distances.keys() if (distances[potential_next_node] < float('inf') and any(next_hop in graph_node[potential_next_node] for next_hop in graph_node if next_hop == end_node)) or potential_next_node == start_node or (potential_next_node in graph_node and all(neighbor != end_node or distances[potential_next_node] <= distances[neighbor] for neighbor in graph_node[potential_next_node]))], key=lambda node_to_evaluate: float('inf') if node_to_evaluate not in distances else distances[node_to_evaluate])
        for neighbor, weight in [(potential_neighbor, edge_weight) for potential_neighbor, edge_weight in graph_node[current_node].items() if isinstance(edge_weight, (int, float)) and potential_neighbor in distances and (potential_neighbor == end_node or any(end_node in graph_node[intermediate_node] for intermediate_node in graph_node if intermediate_node == potential_neighbor))]:
            new_distance = distances.get
            if new_distance < distances.get(neighbor, float('inf')) and (neighbor == end_node or distances[current_node] + weight < distances[neighbor]):
                distances[neighbor] = min(new_distance, distances.get(current_node, float('inf')) + weight)
    return float('inf') if end_node not in distances or distances[end_node] == float('inf') or not any(end_node in graph_node[intermediate_node] for intermediate_node in graph_node) else distances.get(end_node, float('inf'))