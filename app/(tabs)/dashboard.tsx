import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Button, Badge, Chip } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { FirestoreService } from '../../services/firestoreService';
import { TouristRequest } from '../../types';
import { MapPin, Calendar, User } from 'lucide-react-native';

export default function DashboardScreen() {
  const [requests, setRequests] = useState<TouristRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = FirestoreService.subscribeToRequests((newRequests) => {
      setRequests(newRequests);
    });

    return unsubscribe;
  }, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    if (!user) return;
    try {
      await FirestoreService.acceptRequest(requestId, user.uid);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!user) return;
    try {
      await FirestoreService.rejectRequest(requestId, user.uid);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderRequest = ({ item }: { item: TouristRequest }) => (
    <Card style={styles.requestCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.requestInfo}>
            <Text style={styles.touristName}>{item.touristName}</Text>
            <Chip icon={() => <Calendar size={16} color="#666" />} style={styles.dateChip}>
              {new Date(item.requestDate).toLocaleDateString()}
            </Chip>
          </View>
          <Badge style={styles.statusBadge}>Pending</Badge>
        </View>

        <View style={styles.locationContainer}>
          <MapPin size={16} color="#666" />
          <Text style={styles.locationText}>From: {item.location}</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#1976d2" />
          <Text style={styles.destinationText}>To: {item.destination}</Text>
        </View>

        {item.notes && (
          <Text style={styles.notes}>{item.notes}</Text>
        )}

        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={() => handleAcceptRequest(item.id)}
            style={[styles.actionButton, styles.acceptButton]}
            buttonColor="#4caf50"
          >
            Accept
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleRejectRequest(item.id)}
            style={[styles.actionButton, styles.rejectButton]}
            textColor="#f44336"
          >
            Reject
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tourist Requests</Text>
        <Badge style={styles.countBadge}>{requests.length}</Badge>
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <User size={64} color="#ccc" />
            <Text style={styles.emptyText}>No pending requests</Text>
            <Text style={styles.emptySubtext}>New requests will appear here in real-time</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  countBadge: {
    backgroundColor: '#1976d2',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  requestCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
  },
  touristName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateChip: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#ff9800',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  destinationText: {
    marginLeft: 8,
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
  },
  notes: {
    marginTop: 8,
    marginBottom: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 0.48,
  },
  acceptButton: {
    marginRight: 8,
  },
  rejectButton: {
    marginLeft: 8,
    borderColor: '#f44336',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});