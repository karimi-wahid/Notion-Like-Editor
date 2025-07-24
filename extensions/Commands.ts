import { Extension } from "@tiptap/core";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { Editor } from "@tiptap/react";

interface CommandProps {
  editor: Editor;
  range: { from: number; to: number };
  props: {
    command: (args: {
      editor: Editor;
      range: { from: number; to: number };
    }) => void;
    [key: string]: any;
  };
}

interface CommandsExtensionOptions {
  suggestion: Partial<SuggestionOptions> & {
    command: (props: CommandProps) => void;
  };
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    commands: {
      runSlashCommand: (props: CommandProps) => ReturnType;
    };
  }
}

const Commands = Extension.create<CommandsExtensionOptions>({
  name: "commands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }: CommandProps) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default Commands;
