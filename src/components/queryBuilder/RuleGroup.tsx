import React from "react";
import { Card, Button, ButtonGroup, Stack } from "react-bootstrap";
import { RuleGroup, Rule } from "./types";
import RuleRow from "./RuleRow";

interface Props {
  group: RuleGroup;
  onChange: (group: RuleGroup) => void;
}

const RuleGroupComponent: React.FC<Props> = ({ group, onChange }) => {
  const updateRule = (index: number, updated: Rule | RuleGroup) => {
    const rules = [...group.rules];
    rules[index] = updated;
    onChange({ ...group, rules });
  };

  const addRule = () => {
    const newRule: Rule = {
      field: "status",
      operator: "=",
      value: "Active"
    };
    onChange({ ...group, rules: [...group.rules, newRule] });
  };

  const addGroup = () => {
    onChange({
      ...group,
      rules: [...group.rules, { condition: "AND", rules: [] }]
    });
  };

  const removeRule = (index: number) => {
    onChange({
      ...group,
      rules: group.rules.filter((_, i) => i !== index)
    });
  };

  return (
    <Card
      className="mb-3"
      style={{
        borderLeft: "4px solid #6c5ce7"
      }}
    >
      <Card.Body>
        {/* AND / OR Toggle */}
        <Stack
          direction="horizontal"
          gap={2}
          className="mb-3"
        >
          <ButtonGroup>
            <Button
              size="sm"
              variant={group.condition === "AND" ? "primary" : "outline-primary"}
              onClick={() => onChange({ ...group, condition: "AND" })}
            >
              AND
            </Button>
            <Button
              size="sm"
              variant={group.condition === "OR" ? "primary" : "outline-primary"}
              onClick={() => onChange({ ...group, condition: "OR" })}
            >
              OR
            </Button>
          </ButtonGroup>

          <Button
            size="sm"
            variant="outline-success"
            onClick={addRule}
          >
            + Rule
          </Button>

          <Button
            size="sm"
            variant="outline-secondary"
            onClick={addGroup}
          >
            + Group
          </Button>
        </Stack>

        {/* Rules / Nested Groups */}
        {group.rules.map((r, i) =>
          "rules" in r ? (
            <RuleGroupComponent
              key={i}
              group={r}
              onChange={g => updateRule(i, g)}
            />
          ) : (
            <RuleRow
              key={i}
              rule={r}
              onChange={rule => updateRule(i, rule)}
              onDelete={() => removeRule(i)}
            />
          )
        )}
      </Card.Body>
    </Card>
  );
};

export default RuleGroupComponent;
