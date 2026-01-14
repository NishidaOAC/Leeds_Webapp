const amqp = require('amqplib');

class EventPublisher {
  constructor() {
    this.channel = null;
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Skip RabbitMQ if not configured (for development)
      if (!process.env.RABBITMQ_HOST || process.env.RABBITMQ_HOST === 'localhost') {
        console.log('RabbitMQ disabled for development');
        this.isConnected = false;
        return;
      }

      const connectionString = `amqp://${process.env.RABBITMQ_USER || 'guest'}:${process.env.RABBITMQ_PASSWORD || 'guest'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}`;
      
      this.connection = await amqp.connect(connectionString);
      this.channel = await this.connection.createChannel();
      
      // Assert exchange
      await this.channel.assertExchange('user_events', 'topic', { durable: true });
      
      this.isConnected = true;
      console.log('✅ Event publisher connected to RabbitMQ');
    } catch (error) {
      console.log('⚠️  RabbitMQ not available, continuing without event publishing');
      console.log('💡 To enable RabbitMQ: docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management');
      this.isConnected = false;
    }
  }

  async publishEvent(eventType, data) {
    try {
      if (!this.isConnected) {
        // If not connected, try to connect once
        if (this.channel === null) {
          await this.connect();
        }
        
        // If still not connected, just log and continue
        if (!this.isConnected || !this.channel) {
          console.log(`ℹ️  Event skipped (RabbitMQ not available): ${eventType}`);
          return;
        }
      }

      const message = {
        type: eventType,
        data,
        timestamp: new Date().toISOString(),
        service: 'auth-service'
      };

      await this.channel.publish(
        'user_events',
        eventType.toLowerCase(),
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );

      console.log(`✅ Event published: ${eventType}`);
    } catch (error) {
      console.log(`⚠️  Failed to publish event ${eventType}:`, error.message);
      // Don't throw error, just log and continue
    }
  }
}

const publisher = new EventPublisher();

// Export both the instance and the method
module.exports = { 
  publisher,
  publishEvent: publisher.publishEvent.bind(publisher) 
};