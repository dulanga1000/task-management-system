export type ActivityType =
  | "TASK_CREATED"
  | "STATUS_CHANGED"
  | "TITLE_UPDATED"
  | "DESCRIPTION_UPDATED"
  | "DETAILS_UPDATED"
  | "TASK_ASSIGNED"
  | "ATTACHMENT_ADDED"
  | "ATTACHMENT_DELETED"
  | "COMMENT_ADDED";

export interface ActivityUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
}

export interface ActivityDetails {
  oldValue?: string;
  newValue?: string;
  fileName?: string;
  assignedToName?: string;
  comment?: string;
}

export interface TaskActivity {
  _id: string;
  task: string;
  user: ActivityUser;
  type: ActivityType;
  details?: ActivityDetails;
  createdAt: string;
  updatedAt: string;
}

export interface ActivitiesResponse {
  success: boolean;
  data: TaskActivity[];
}

export interface AddCommentResponse {
  success: boolean;
  message: string;
  data: TaskActivity;
}
