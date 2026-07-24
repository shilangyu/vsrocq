import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import "./App.css";

import ProofViewPage from "./components/templates/ProofViewPage";
import {
    Goal,
    ProofViewGoals,
    ProofViewGoalsKey,
    ProofViewMessage,
    VSCodeMessage,
} from "./types";

import { vscode } from "./utilities/vscode";

const app = () => {
    const [goals, setGoals] = useState<ProofViewGoals>(null);
    const [messages, setMessages] = useState<ProofViewMessage[]>([]);
    const [goalDisplaySetting, setGoalDisplaySetting] = useState<
        "List" | "Tabs"
    >("List");
    const [goalDepth, setGoalDepth] = useState<number>(10);
    const [helpMessage, setHelpMessage] = useState<string>("");

    const handleMessage = useCallback((msg: { data: VSCodeMessage }) => {
        switch (msg.data.command) {
            case "updateDisplaySettings":
                setGoalDisplaySetting(msg.data.display);
                break;
            case "updateGoalDepth":
                setGoalDepth(msg.data.maxDepth);
                break;
            case "renderProofView":
                const proofView = JSON.parse(msg.data.proofView);
                const allGoals = proofView.proof;
                const messages = proofView.messages;
                console.log(
                    "Got the goal view! Got it at: " +
                        new Date().toLocaleTimeString(),
                );
                /*
                console.log(
                    "Size in approximate bytes: " +
                        JSON.stringify(proofView).length,
                ); */
                setMessages(messages);
                setGoals(
                    allGoals === null
                        ? allGoals
                        : {
                              main: allGoals.goals.map(
                                  (goal: Goal, index: number) => {
                                      return {
                                          ...goal,
                                          isOpen: true,
                                          isContextHidden: index !== 0,
                                      };
                                  },
                              ),
                              shelved: allGoals.shelvedGoals.map(
                                  (goal: Goal, index: number) => {
                                      return {
                                          ...goal,
                                          isOpen: true,
                                          isContextHidden: index !== 0,
                                      };
                                  },
                              ),
                              givenUp: allGoals.givenUpGoals.map(
                                  (goal: Goal, index: number) => {
                                      return {
                                          ...goal,
                                          isOpen: true,
                                          isContextHidden: index !== 0,
                                      };
                                  },
                              ),
                              unfocused: allGoals.unfocusedGoals.map(
                                  (goal: Goal, index: number) => {
                                      return {
                                          ...goal,
                                          isOpen: false,
                                          isContextHidden: index !== 0,
                                      };
                                  },
                              ),
                          },
                );
                break;
            case "reset":
                setMessages([]);
                setGoals(null);
                break;
        }
    }, []);

    useLayoutEffect(() => {
        console.log(
            "Done rendering goal view at: " + new Date().toLocaleTimeString(),
        );
    }, [Math.random()]);

    useEffect(() => {
        window.addEventListener("message", handleMessage);
        vscode.postMessage({ command: "pollGoals" });
        vscode.postMessage({ command: "pollDisplaySettings" });
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [handleMessage]);

    const collapseGoalHandler = (id: string, key: ProofViewGoalsKey) => {
        const newGoals = goals![key].map((goal) => {
            if (goal.id === id) {
                return { ...goal, isOpen: !goal.isOpen };
            }
            return goal;
        });
        setGoals({
            ...goals!,
            [key]: newGoals,
        });
    };

    const toggleContext = (id: string, key: ProofViewGoalsKey) => {
        const newGoals = goals![key].map((goal) => {
            if (goal.id === id) {
                return { ...goal, isContextHidden: !goal.isContextHidden };
            }
            return goal;
        });
        setGoals({
            ...goals!,
            [key]: newGoals,
        });
    };

    const settingsClickHandler = () => {
        vscode.postMessage({
            command: "openGoalSettings",
        });
    };

    return (
        <main>
            I have {goals?.main.length} main goals, {goals?.shelved.length}{" "}
            shelved goals, and {goals?.givenUp.length} given up goals.
            {true && (
                <ProofViewPage
                    goals={goals}
                    messages={messages}
                    collapseGoalHandler={collapseGoalHandler}
                    displaySetting={goalDisplaySetting}
                    maxDepth={goalDepth}
                    settingsClickHandler={settingsClickHandler}
                    helpMessage={helpMessage}
                    helpMessageHandler={(message: string) =>
                        setHelpMessage(message)
                    }
                    toggleContextHandler={toggleContext}
                />
            )}
        </main>
    );
};

export default app;
