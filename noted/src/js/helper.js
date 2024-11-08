const parseDeepestNode = (data) => {
    // Function to recursively find the deepest node
    const findDeepestNode = (obj) => {
        if (Array.isArray(obj)) {
            return findDeepestNode(obj[0]);
        } else if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) {
                return obj;
            }
            return findDeepestNode(obj[keys[0]]);
        } else {
            return obj;
        }
    };

    // Call findDeepestNode with the input data
    return findDeepestNode(data);
};
