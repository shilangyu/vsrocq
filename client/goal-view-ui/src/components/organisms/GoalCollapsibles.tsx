import { FunctionComponent, useEffect, useRef } from "react";

import { CollapsibleGoal } from "../../types";
import CollapsibleGoalBlock from "../molecules/CollapsibleGoalBlock";

import { List, RowComponentProps, useDynamicRowHeight } from "react-window";
import classes from "./GoalCollapsibles.module.css";

type GoalSectionProps = {
    goals: CollapsibleGoal[];
    collapseGoalHandler: (id: string) => void;
    toggleContextHandler: (id: string) => void;
    maxDepth: number;
    helpMessageHandler: (message: string) => void;
};

const goalSection: FunctionComponent<GoalSectionProps> = (props) => {
    const firstGoalRef = useRef<HTMLDivElement>(null);
    const rowHeight = useDynamicRowHeight({
        defaultRowHeight: 88,
    });

    useEffect(() => {
        scrollToBottomOfFirstGoal();
    }, [props.goals]);

    const scrollToBottomOfFirstGoal = () => {
        if (firstGoalRef.current) {
            firstGoalRef.current.scrollIntoView({
                // behavior: "smooth",
                block: "end",
                inline: "nearest",
            });
        }
    };

    return (
        <List
            className={classes.Collapsibles}
            rowComponent={RowComponent}
            rowCount={props.goals.length}
            rowHeight={rowHeight}
            rowProps={props}
        />
    );
};

function RowComponent({
    goals,
    collapseGoalHandler,
    toggleContextHandler,
    maxDepth,
    helpMessageHandler,
    index,
}: RowComponentProps<GoalSectionProps>) {
    let goal = goals[index];
    return (
        <CollapsibleGoalBlock
            goal={goal}
            goalIndex={index + 1}
            goalIndicator={index + 1 + " / " + goals.length}
            collapseHandler={collapseGoalHandler}
            toggleContextHandler={toggleContextHandler}
            maxDepth={maxDepth}
            helpMessageHandler={helpMessageHandler}
        />
    );
}

export default goalSection;
