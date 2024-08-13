import {
  FlatList,
  ListRenderItem,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import db from "../../sqlite/sqlite";
import { useTodos } from "./useTodos";
import { Todo } from "./todo";
import TodoItem from "./TodoItem";
import { ImagesAssets } from "../../assets/ImagesAssets";

export default function TodoList() {
  const { todos, getTodos, addTodo, updateTodo, deleteTodo } = useTodos();

  const textInputRef = useRef<TextInput>(null);

  const [title, setTitle] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleAddTodo = () => {
    addTodo(db, title);

    setTitle("");
    textInputRef?.current?.clear();
    textInputRef?.current?.focus();
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(db, id);
  };

  const handleUpdateTodo = (id: number, newTitle: string) => {
    updateTodo(db, id, newTitle);
    setEditMode(false);
  };

  useEffect(() => {
    getTodos(db);
  }, []);

  const renderItem: ListRenderItem<Todo> = ({ item: todo }) => {
    return (
      <TodoItem
        todo={todo}
        editable={editMode}
        onDeletePress={handleDeleteTodo}
        onUpdatePress={handleUpdateTodo}
      />
    );
  };

  const handleChangeText = (text: string) => setTitle(text);
  const handleEditPress = () => setEditMode(!editMode);

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { marginBottom: 16 }]}>
        <Text style={styles.header}>Task List</Text>

        {editMode ? (
          <TouchableOpacity onPress={handleEditPress}>
            <Image
              source={ImagesAssets.cancelIcon}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleEditPress}>
            <Image
              source={ImagesAssets.editIcon}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.headerContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          placeholder="Add new task..."
          onChangeText={handleChangeText}
        />

        <TouchableOpacity onPress={handleAddTodo} disabled={!title}>
          <Image
            source={ImagesAssets.addIcon}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      </View>
      <Text>{``}</Text>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(todo) => todo.id.toString()}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<Text>No todos...</Text>}
        ItemSeparatorComponent={ItemSeparator}
      />
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
    flex: 1,
    paddingTop: 30,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 16,
  },

  header: {
    fontWeight: "bold",
    fontSize: 36,
    verticalAlign: "bottom",
  },

  contentContainer: {
    padding: 16,
    gap: 10,
    backgroundColor: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
});
