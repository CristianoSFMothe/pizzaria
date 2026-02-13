import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { Text, View } from "react-native";

const Dashboard = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Text>Pagina Dashboard</Text>
      <Text>Pagina Dashboard</Text>
      <Text>Pagina Dashboard</Text>
      <Text>Pagina Dashboard</Text>
      <Text>Pagina Dashboard</Text>
      <Text>Pagina Dashboard</Text>
      <Text>Pagina Dashboard</Text>
      <Text>Pagina Dashboard</Text>
      <Text>Pagina Dashboard</Text>
      <Text>Pagina Dashboard</Text>
      <Text>Pagina Dashboard</Text>

      <Button title="Sair" onPress={signOut} />
    </View>
  );
};

export default Dashboard;
