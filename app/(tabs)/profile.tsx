import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, Button, Avatar, Divider } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { User, Mail, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Icon size={80} icon={() => <User size={40} color="white" />} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Guide Profile</Text>
              <View style={styles.emailContainer}>
                <Mail size={16} color="#666" />
                <Text style={styles.email}>{user?.email}</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <Divider style={styles.divider} />
          
          <Button
            mode="outlined"
            onPress={handleLogout}
            icon={() => <LogOut size={16} color="#f44336" />}
            textColor="#f44336"
            style={styles.logoutButton}
          >
            Logout
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>App Information</Text>
          <Divider style={styles.divider} />
          <Text style={styles.infoText}>Tour Guide App v1.0</Text>
          <Text style={styles.infoSubtext}>Real-time request management system</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  profileCard: {
    marginBottom: 16,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  email: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  infoCard: {
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  logoutButton: {
    borderColor: '#f44336',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#666',
  },
});