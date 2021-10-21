INSERT INTO public.history
(command, slack_id, "timestamp", organization_slack_id, organization_name, from_user_slack_id, to_user_slack_id, amount, value)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT(slack_id) DO NOTHING;
