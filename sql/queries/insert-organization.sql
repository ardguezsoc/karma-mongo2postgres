INSERT INTO public.organization
(slack_id, "name")
VALUES($1, $2)
ON CONFLICT (slack_id) DO NOTHING;
