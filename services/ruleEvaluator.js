
// Helper function to evaluate a single condition
function evaluateCondition(object, condition) {
    const { field, operator, value } = condition;

    // To ensure the field exists in the object
    if (!(field in object)) {
        console.error(`Field '${field}' not found in the object.`);
        return false;
    }

    const objectValue = object[field];

    // Evaluate the condition based on the operator
    switch (operator) {
        case '>': return objectValue > value;
        case '<': return objectValue < value;
        case '>=': return objectValue >= value;
        case '<=': return objectValue <= value;
        case '==': return objectValue == value; 
        case '!=': return objectValue != value; 
        default:
            console.error(`Unsupported operator: ${operator}`);
            return false;
    }
}


// Function to evaluate rules against an object
function evaluateRule(object, rule) {
    const { conditions, logic = 'AND' } = rule; // Default to 'AND'

    console.log(`Evaluating rule: ${rule.ruleName} for object:`, object);
    console.log(`Conditions:`, conditions);
    if (!Array.isArray(conditions) || conditions.length === 0) {
        console.error(`No conditions found for rule: ${rule.ruleName}`);
        return false;
    }

    // AND/OR logic
    const evaluationResult = logic === 'AND'
        ? conditions.every(condition => evaluateCondition(object, condition))
        : logic === 'OR'
            ? conditions.some(condition => evaluateCondition(object, condition))
            : (() => {
                console.error(`Unsupported logic: ${logic}`);
                return false;
            })();

    return evaluationResult;
}


// Main function to evaluate multiple objects against rules
function evaluateObjectsAgainstRules(objects, rules) {
    return objects.map(object => {
        const matchedRules = rules.filter(rule => evaluateRule(object, rule));
        return {
            ...object,
            matchedRules: matchedRules.map(rule => rule.ruleName),
            isValid: matchedRules.length > 0 // track if any rules matched
        };
    });
}


module.exports = { evaluateObjectsAgainstRules };
