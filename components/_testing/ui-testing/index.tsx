import React, { useState } from "react";
import { View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  List,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import { useAppToast } from "@/components/common/AppToastProvider";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section = ({ title, children }: SectionProps) => (
  <View style={{ marginBottom: 32 }}>
    <Text variant="titleMedium">{title}</Text>
    <View style={{ gap: 12, marginTop: 12 }}>{children}</View>
  </View>
);

const UITesting = () => {
  const [name, setName] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const { showToast } = useAppToast();

  return (
    <View style={{ width: "100%", gap: 24 }}>
      <Text variant="headlineMedium">React Native Paper Kitchen Sink</Text>
      <Text variant="bodyMedium">
        This page demonstrates a small selection of components from React
        Native Paper. Use it as a quick visual check for styling and behavior.
      </Text>

      <Section title="Buttons">
        <Button mode="contained" onPress={() => {}}>
          Contained button
        </Button>
        <Button mode="outlined" onPress={() => {}}>
          Outlined button
        </Button>
        <Button onPress={() => {}}>Text button</Button>
      </Section>

      <Section title="Form Controls">
        <TextInput
          label="Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Ada Lovelace"
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text variant="bodyMedium">Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
      </Section>

      <Section title="Card & List">
        <Card>
          <Card.Title
            title="Project Delta"
            subtitle="Updated 2 minutes ago"
            left={(props) => <Avatar.Icon {...props} icon="folder" />}
          />
          <Card.Content>
            <Text variant="bodyMedium">
              Cards group related content and actions. Use them for dashboards,
              lists of tasks, or feature summaries.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => {}}>Details</Button>
            <Button onPress={() => {}}>Share</Button>
          </Card.Actions>
        </Card>

        <Divider />

        <List.Section>
          <List.Item
            title="Inbox"
            description="3 unread messages"
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <List.Item
            title="Calendar"
            description="Next meeting at 2:00 PM"
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />
          <List.Item
            title="Downloads"
            description="Latest report is ready"
            left={(props) => <List.Icon {...props} icon="download" />}
          />
        </List.Section>
      </Section>

      <Section title="Chips">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Chip
            selected={filterEnabled}
            onPress={() => setFilterEnabled((prev) => !prev)}
          >
            Filter
          </Chip>
          <Chip icon="information">Info</Chip>
          <Chip icon="star">Favorites</Chip>
        </View>
      </Section>

      <Section title="Notifications">
        <Button
          mode="contained-tonal"
          onPress={() =>
            showToast(`Demo toast fired at ${new Date().toLocaleTimeString()}`)
          }
        >
          Show Snackbar (Paper toast)
        </Button>
      </Section>
    </View>
  );
};

export default UITesting;
