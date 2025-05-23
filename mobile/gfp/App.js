import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/pages/Login";
import MenuDrawer from "./src/pages/MenuDrawer";
import Principal from "./src/pages/Principal";
import CadContas from "./src/pages/CadContas";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
       screenOptions={{
            headerStyle:{
                backgroundColor: '#f00',
                elevation: 0,
            },
            headerTintColor: '#fff',
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MenuDrawer" component={MenuDrawer}/>
        <Stack.Screen name="CadContas" component={CadContas}
        options={{title: 'Cadastro de Contas'}} />
        
        <Stack.Screen name="Principal" component={Principal}
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

