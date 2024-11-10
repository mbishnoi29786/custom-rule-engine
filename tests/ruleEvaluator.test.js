const { evaluateCondition, evaluateRule, evaluateObjectsAgainstRules } = require('../services/ruleEvaluator.js');

// to test the evaluateCondition Function
describe('evaluateCondition Function', () => {
    it('should return true when the condition is met', () => {
        const object = { age: 25 };
        const condition = { field: 'age', operator: '>', value: 20 };
        expect(evaluateCondition(object, condition)).toBe(true);
    });

    it('should return false when the condition is not met', () => {
        const object = { age: 15 };
        const condition = { field: 'age', operator: '>', value: 20 };
        expect(evaluateCondition(object, condition)).toBe(false);
    });
});

// To test evaluateRule Function
describe('evaluateRule Function', () => {
    it('should return true when all conditions are met with AND logic', () => {
        const object = { age: 25, score: 80 };
        const rule = {
            ruleName: 'Age and Score Check',
            conditions: [
                { field: 'age', operator: '>', value: 20 },
                { field: 'score', operator: '>=', value: 75 }
            ],
            logic: 'AND'
        };
        expect(evaluateRule(object, rule)).toBe(true);
    });

    it('should return false when one condition fails with AND logic', () => {
        const object = { age: 25, score: 70 };
        const rule = {
            ruleName: 'Age and Score Check',
            conditions: [
                { field: 'age', operator: '>', value: 20 },
                { field: 'score', operator: '>=', value: 75 }
            ],
            logic: 'AND'
        };
        expect(evaluateRule(object, rule)).toBe(false);
    });

    it('should return true when at least one condition is met with OR logic', () => {
        const object = { age: 25, score: 70 };
        const rule = {
            ruleName: 'Age or Score Check',
            conditions: [
                { field: 'age', operator: '>', value: 30 },
                { field: 'score', operator: '>=', value: 65 }
            ],
            logic: 'OR'
        };
        expect(evaluateRule(object, rule)).toBe(true);
    });
});

// to evaluate main function evaluateObjectAgainstRule
describe('evaluateObjectsAgainstRules Function', () => {
    it('should correctly evaluate multiple objects against multiple rules', () => {
        const objects = [
            { name: 'Alice', age: 25, score: 85 },
            { name: 'Bob', age: 19, score: 65 }
        ];

        const rules = [
            {
                ruleName: 'Age Check',
                conditions: [{ field: 'age', operator: '>=', value: 20 }],
                logic: 'AND'
            },
            {
                ruleName: 'Score Check',
                conditions: [{ field: 'score', operator: '>', value: 80 }],
                logic: 'AND'
            }
        ];

        const result = evaluateObjectsAgainstRules(objects, rules);

        // Alice should pass both rules
        expect(result[0].matchedRules).toContain('Age Check');
        expect(result[0].matchedRules).toContain('Score Check');
        expect(result[0].isValid).toBe(true);

        // Bob should only pass the 'Age Check'
        expect(result[1].matchedRules).toContain('Age Check');
        expect(result[1].matchedRules).not.toContain('Score Check');
        expect(result[1].isValid).toBe(true);
    });
});
