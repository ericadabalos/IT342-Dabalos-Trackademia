import styled from "styled-components";
import { LOG_ICONS } from "./constants";

const ActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #0d1220;
  border: 1px solid #1e2a45;
  border-radius: 12px;
  font-size: 12px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    background: #141a28;
    border-color: #2a3a5a;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`;

const TextContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ActivityText = styled.p`
  margin: 0;
  color: #8da4c8;
  font-weight: 500;
  line-height: 1.5;
  font-family: 'Inter', sans-serif;
`;

const ActivityTime = styled.p`
  margin: 0;
  color: #4a6080;
  font-size: 11px;
`;

export function ActivityFeed({ activities }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (!activities || activities.length === 0) {
    return (
      <ActivityContainer>
        <ActivityItem>
          <IconWrapper>ℹ️</IconWrapper>
          <TextContent>
            <ActivityText>No activities yet</ActivityText>
            <ActivityTime>Create your first task to get started</ActivityTime>
          </TextContent>
        </ActivityItem>
      </ActivityContainer>
    );
  }

  return (
    <ActivityContainer>
      {activities.map(activity => (
        <ActivityItem key={activity.id}>
          <IconWrapper>
            {LOG_ICONS[activity.type] || "📌"}
          </IconWrapper>
          <TextContent>
            <ActivityText>{activity.text}</ActivityText>
            <ActivityTime>{formatTime(activity.timestamp)}</ActivityTime>
          </TextContent>
        </ActivityItem>
      ))}
    </ActivityContainer>
  );
}
