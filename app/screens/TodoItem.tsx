import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Todo } from "./todo";
import { ImagesAssets } from "../../assets/ImagesAssets";

interface TodoItemProps {
  todo: Todo;
  editable: boolean;
  onDeletePress: (id: number) => void;
  onUpdatePress: (id: number, newTitle: string) => void;
}

export default function TodoItem({
  todo,
  editable,
  onDeletePress,
  onUpdatePress,
}: TodoItemProps) {
  const [title, setTitle] = useState<string>();

  const handleDeleteTodo = () => {
    onDeletePress(todo.id);
  };

  const handleUpdateTodo = () => {
    if (title) {
      onUpdatePress(todo.id, title);
    }
  };

  const handleChangeText = (text: string) => setTitle(text);

  useEffect(() => {
    setTitle(todo.title);
  }, [editable]);

  return (
    <View style={styles.container}>
      {editable ? (
        <TextInput
          style={styles.textInput}
          defaultValue={todo.title}
          placeholder="Todo Title"
          onChangeText={handleChangeText}
        />
      ) : (
        <Text>{`${todo.title}`}</Text>
      )}

      <View style={styles.rowContainer}>
        {editable ? (
                <TouchableOpacity onPress={handleUpdateTodo} disabled={!title} >
                <Image source={ImagesAssets.saveIcon} style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
        ) : (
                <TouchableOpacity onPress={handleDeleteTodo}>
                  <Image source={ImagesAssets.deleteIcon} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderColor: "gray",
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },

  rowContainer: {
    flexDirection: "row",
    gap: 8,
  },
});