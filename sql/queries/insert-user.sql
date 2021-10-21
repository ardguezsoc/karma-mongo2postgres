INSERT INTO public.users (slack_id, organization, email)
VALUES($1, $2, $3)
ON CONFLICT (slack_id) DO NOTHING;
