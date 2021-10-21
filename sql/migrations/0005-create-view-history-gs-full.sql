CREATE OR REPLACE view history_gs_full AS
SELECT
	h.command, h."timestamp", h.organization_slack_id , h.organization_name,
	h.from_user_slack_id AS from_user, h.to_user_slack_id AS to_user,
	h.amount, h.value,
	uf.slack_id AS from_user_id, uf.email AS from_email,
	ifrom.name AS from_name, ifrom.first_name AS from_first_name, ifrom.last_name AS from_last_name,
	ifrom.real_name AS from_real_name, ifrom.real_name_normalized AS from_real_name_normalized,
	ifrom.display_name AS from_display_name, ifrom.display_name_normalized AS from_display_name_normalized,
	ifrom.image AS from_image, ifrom.color AS from_color,
	ut.slack_id AS to_user_id, ut.email AS to_email,
	ito.name AS to_name, ito.first_name AS to_first_name, ito.last_name AS to_last_name,
	ito.real_name AS to_real_name, ito.real_name_normalized AS to_real_name_normalized,
	ito.display_name AS to_display_name, ito.display_name_normalized AS to_display_name_normalized,
	ito.image AS to_image, ito.color AS to_color
FROM history h
LEFT JOIN users uf ON h.from_user_slack_id = uf.slack_id
LEFT JOIN users ut ON h.to_user_slack_id = ut.slack_id
LEFT JOIN infousers ifrom ON uf.slack_id = ifrom.slack_id
LEFT JOIN infousers ito ON ut.slack_id = ito.slack_id
WHERE h.organization_name = 'GuideSmiths';
