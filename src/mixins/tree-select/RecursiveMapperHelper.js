export const RecursiveMapperHelper = {
  methods: {
    flattenHierarchy(data, parentIds = [], result = []) {
      for (const item of data) {
        const newItem = { ...item, parentIds: [...parentIds] };
        result.push(newItem);
        if (item.children && item.children.length > 0) {
          this.flattenHierarchy(item.children, [...parentIds, item.id], result);
        }
      }
      return result;
    },
    recursiveMapperForSelect(item) {
      return {
        key: item.id,
        label: item.name,
        data: item.id,
        selectable: item.type === "item",
        icon:
          item.type === "group"
            ? "fe fe-folder"
            : item.type === "item"
            ? "fe fe-link-2"
            : null,
        children: item.children?.map(this.recursiveMapperForSelect),
      };
    },
    hasIdInTree(nodes, targetId) {
      if (!targetId || !Array.isArray(nodes)) return false;

      for (const node of nodes) {
        if (node.id === targetId) {
          return true;
        }

        if (node.children?.length) {
          if (this.hasIdInTree(node.children, targetId)) {
            return true;
          }
        }
      }

      return false;
    },
  },
};
