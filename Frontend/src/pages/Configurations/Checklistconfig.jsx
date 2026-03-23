import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Checklistconfig.css";

const STAGE_OPTIONS  = ["Initial", "Pending", "Approved"];
const STATUS_OPTIONS = ["Active", "Inactive"];
const PAGE_SIZES     = [5, 10, 20, 50];

const INITIAL_ROWS = [
  { id:1, shortDis:"Are the privileges group created and privileges...", fullDis:"Are the privileges group created and privileges assigned to groups as per the SOP?  (With the help of software Administrator)", type:"CHR_SAT", stage:"High", status:"Inactive", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:2, shortDis:"Are the user management security settings set a...", fullDis:"Are the user management security settings set as per SOP?   (With the help of software Administrator)", type:"CHR_SAT", stage:"Low", status:"Inactive", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:3, shortDis:"Are the User ID's (Including Hardware engineer)...", fullDis:"Are the User ID's (Including Hardware engineer) and Guest user created as per the procedure (With the help of software Administrator) and locked after completion of the activity.", type:"CHR_SAT", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:4, shortDis:"Are the following user ID's disabled: Left the ...", fullDis:"Are the following user ID's disabled: Left the organization, Guest User", type:"CHR_SAT", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:5, shortDis:"Review of following events in audit trail of Da...", fullDis:"Review of following events in audit trail of Datavault manager, apart from database mentioned in 1035-D-0007: Datavault Mounted, Datavault Dismounted, Datavault Created, Change in Organization unit", type:"CHR_SAT_DIG", stage:"Low", status:"Inactive", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:6, shortDis:"Review of Domain Resource audit trail The works...", fullDis:"Review of Domain Resource audit trail The workstations which are discontinued, to be removed from the admin console", type:"CHR_SAT_DIG", stage:"Low", status:"Inactive", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:7, shortDis:"Are the privileges group created and privileges...", fullDis:"Are the privileges group created and privileges assigned to groups as per the SOP?  (With the help of Global software Administrator)", type:"CHR_SAT", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:8, shortDis:"Are the user management Global security setting...", fullDis:"Are the user management Global security settings set as per SOP?  (With the help of Global software Administrator)", type:"CHR_SAT", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:9, shortDis:"Are the User ID's (Including service engineer) ...", fullDis:"Are the User ID's (Including service engineer) and Guest user created/deactivated/retired as per defined procedure and Training Pre-requisites is available. (As applicable)   (With the help of Global software Administrator)", type:"CHR_SAT", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:10, shortDis:"Review of Global audit trail, Site datavault in...", fullDis:"Review of Global audit trail, Site datavault in the Global, Site workstation configured in Global, Other activities getting captured in Global audit trail related to site specific", type:"CHR_SAT_DIG", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:11, shortDis:"Others If Any", fullDis:"Others If Any", type:"CHR_SAT", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:12, shortDis:"Check audit trail for sequence interruptions, a...", fullDis:"Check audit trail for sequence interruptions, abort sequence etc. is handled as per SOP 1035-L-0147 (Laboratory Incidence investigation and Resolution Procedure)?", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:13, shortDis:"Are the prohibited parameters like Inhibit Inte...", fullDis:"Are the prohibited parameters like Inhibit Integration, Peak Group start, Peak group end and Lock Baseline point is used in the processing method as per SOP 1035-L-0142?", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:14, shortDis:"Check, in case of updation of the processing me...", fullDis:"Check, in case of updation of the processing method (as per SOP 1035-L-0142, Integration of Chromatographic Data in Chromeleon 7 software) processing method is renamed with suffix \"@\" after approval.", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:15, shortDis:"Check any deletion details captured in audit tr...", fullDis:"Check any deletion details captured in audit trail, after completion of sequence", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:16, shortDis:"Check appropriate Comments under the Reviewer...", fullDis:"Check appropriate Comments under the Reviewer Remark column is added by reviewer wherever interruption of injection or abort information is getting captured in the audit trail", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:17, shortDis:"Is the Sample Weight, Standard Weight, sample o...", fullDis:"Is the Sample Weight, Standard Weight, sample or standard dilution factor, Batch number, AR Number, Average weight, Purity, Multiplication factor, Label Claim, Conversion factor and other calculations variables are changed after completion of sequence/respective injections by the user?", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:18, shortDis:"Replicate Standards added in the Calibration ta...", fullDis:"Replicate Standards added in the Calibration tab page in the processing method is of the same sequence.", type:"CHR_DIG", stage:"-", status:"Inactive", system:"CDS", module:"Chromeleon", digital:"True", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:19, shortDis:"Run a query to check the same Sample ID number ...", fullDis:"Run a query to check the same Sample ID number injected earlier for same test.", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:20, shortDis:"All Master Data modification ex. Report templat...", fullDis:"All Master Data modification ex. Report template, processing method, Instrument method etc. should be captured.", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:21, shortDis:"If injection gap more than 2 hrs from completio...", fullDis:"If injection gap more than 2 hrs from completion of injection then standard injection should be available and needs to capture if no standard injection injected", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:22, shortDis:"All changes captured under data audit trail sho...", fullDis:"All changes captured under data audit trail should be captured after sequences is started", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:23, shortDis:"Is Sequence Undo by reviewer or Software functi...", fullDis:"Is Sequence Undo by reviewer or Software functional head is documented as per SOP 1035-L-0141 (Electronic Signature in Chromeleon 7 Software), wherever applicable", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:24, shortDis:"Review of the instrument configuration audit tr...", fullDis:"Review of the instrument configuration audit trail. For change in response factor", type:"CHR_SAT_DIG", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:25, shortDis:"Errors, warning and abort error messages logged...", fullDis:"Errors, warning and abort error messages logged in injection audit trail after start of the sequence should be captured.", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:26, shortDis:"Replicate Standards added in the Calibration ta...", fullDis:"Replicate Standards added in the Calibration tab page in the processing method is of the same sequence. Last update should be displayed", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:27, shortDis:"Pending for Sign-Off Level-", fullDis:"Pending for Sign-Off Level-", type:"SATR", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:28, shortDis:"Unprocessed Channels", fullDis:"Unprocessed Channels", type:"SATR", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:29, shortDis:"Sample Set Finished Date incomplete", fullDis:"Sample Set Finished Date incomplete", type:"SATR", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:30, shortDis:"There are no Major breaks in the acquisition ti...", fullDis:"There are no Major breaks in the acquisition times", type:"SATR", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:31, shortDis:"All the samples and standards are processed wit...", fullDis:"All the samples and standards are processed with the same processing method", type:"SATR", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:32, shortDis:"Channels marked as Manually integrated", fullDis:"Channels marked as Manually integrated", type:"SATR", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:33, shortDis:"Incomplete Data/ Missing Data/ Data File incomp...", fullDis:"Incomplete Data/ Missing Data/ Data File incomplete entries", type:"SATR", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:34, shortDis:"Single injections (Not associated with any samp...", fullDis:"Single injections (Not associated with any sample set)", type:"SATR", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:35, shortDis:"Sample set Aborted", fullDis:"Sample set Aborted", type:"SATR", stage:"High", status:"Inactive", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:36, shortDis:"Any Entry related to Deletion in the Project Au...", fullDis:"Any Entry related to Deletion in the Project Audit trail", type:"SATR", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:37, shortDis:"There are no duplicate sample sets created for ...", fullDis:"There are no duplicate sample sets created for the same", type:"SATR", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:38, shortDis:"Altered AutoArchive Property", fullDis:"Altered AutoArchive Property", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:39, shortDis:"Altered Custom Time Zone List", fullDis:"Altered Custom Time Zone List", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:40, shortDis:"Altered System Policy", fullDis:"Altered System Policy", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:41, shortDis:"Archived and Removed Audit Trail", fullDis:"Archived and Removed Audit Trail", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:42, shortDis:"Archived and Removed Project/Sample Archive", fullDis:"Archived and Removed Project/Sample Archive", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:43, shortDis:"Auto Removed Entries from Message Board", fullDis:"Auto Removed Entries from Message Board", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:44, shortDis:"Cloned Project", fullDis:"Cloned Project", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:45, shortDis:"Created User", fullDis:"Created User", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:46, shortDis:"Created User Type", fullDis:"Created User Type", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:47, shortDis:"Deleted Default String", fullDis:"Deleted Default String", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:48, shortDis:"Deleted eCord Column", fullDis:"Deleted eCord Column", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:49, shortDis:"Deleted Library", fullDis:"Deleted Library", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:50, shortDis:"Deleted Node", fullDis:"Deleted Node", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:51, shortDis:"Deleted Plate Type", fullDis:"Deleted Plate Type", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:52, shortDis:"Deleted Project", fullDis:"Deleted Project", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:53, shortDis:"Deleted Project Data At Source", fullDis:"Deleted Project Data At Source", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:54, shortDis:"Deleted Report Group", fullDis:"Deleted Report Group", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:55, shortDis:"Deleted Spectra", fullDis:"Deleted Spectra", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:56, shortDis:"Deleted Structure", fullDis:"Deleted Structure", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:57, shortDis:"Deleted System", fullDis:"Deleted System", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:58, shortDis:"Deleted User", fullDis:"Deleted User", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:59, shortDis:"Deleted User Group", fullDis:"Deleted User Group", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:60, shortDis:"Deleted User Type", fullDis:"Deleted User Type", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:61, shortDis:"Modified User", fullDis:"Modified User", type:"SAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:62, shortDis:"Modified User Type", fullDis:"Modified User Type", type:"SAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:63, shortDis:"Removed Entries from Message Board", fullDis:"Removed Entries from Message Board", type:"SAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:64, shortDis:"Renamed Node", fullDis:"Renamed Node", type:"SAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:65, shortDis:"Aborted Single Injection", fullDis:"Aborted Single Injection", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:66, shortDis:"Aborted Sample Set", fullDis:"Aborted Sample Set", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:67, shortDis:"Altered Sample", fullDis:"Altered Sample", type:"PAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:68, shortDis:"Renamed Sample Set", fullDis:"Renamed Sample Set", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:69, shortDis:"Altered Sample Set", fullDis:"Altered Sample Set", type:"PAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:70, shortDis:"Unlocked Channel", fullDis:"Unlocked Channel", type:"PAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:71, shortDis:"Unlocked Channels Of Injection", fullDis:"Unlocked Channels Of Injection", type:"PAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:72, shortDis:"Unlocked Channels Of Sample Set", fullDis:"Unlocked Channels Of Sample Set", type:"PAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:73, shortDis:"Deleted Custom Field", fullDis:"Deleted Custom Field", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:74, shortDis:"Deleted Method", fullDis:"Deleted Method", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:75, shortDis:"Deleted Channel", fullDis:"Deleted Channel", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:76, shortDis:"Deleted Injection", fullDis:"Deleted Injection", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:77, shortDis:"Deleted Sample Set", fullDis:"Deleted Sample Set", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:78, shortDis:"Deleted Calibration", fullDis:"Deleted Calibration", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:79, shortDis:"Deleted Result", fullDis:"Deleted Result", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:80, shortDis:"Deleted Result Set", fullDis:"Deleted Result Set", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:81, shortDis:"Deleted Report Group", fullDis:"Deleted Report Group", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:82, shortDis:"Modified Custom Field", fullDis:"Modified Custom Field", type:"PAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:83, shortDis:"Run Single Injection", fullDis:"Run Single Injection", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:84, shortDis:"Renamed Project", fullDis:"Renamed Project", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:85, shortDis:"Renamed System", fullDis:"Renamed System", type:"SAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:86, shortDis:"Unlocked Project", fullDis:"Unlocked Project", type:"SAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:87, shortDis:"User Account Disabled", fullDis:"User Account Disabled", type:"SAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:88, shortDis:"Single injections (Not associated with any samp...", fullDis:"Single injections (Not associated with any sample set)", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:89, shortDis:"Unprocessed channels", fullDis:"Unprocessed channels", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:90, shortDis:"Incomplete Data/ Missing Data/ Data File Incomp...", fullDis:"Incomplete Data/ Missing Data/ Data File Incomplete entries", type:"PAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:91, shortDis:"Sample sets which are created but not executed", fullDis:"Sample sets which are created but not executed", type:"PAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:92, shortDis:"ReProcessed Results", fullDis:"ReProcessed Results", type:"PAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:93, shortDis:"Pending for Sign-Off Level-1", fullDis:"Pending for Sign-Off Level-1", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:94, shortDis:"Pending for Sign-Off Level-2", fullDis:"Pending for Sign-Off Level-2", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:95, shortDis:"Channels which are not locked after Sign-Off Le...", fullDis:"Channels which are not locked after Sign-Off Level-2", type:"PAT", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:96, shortDis:"Channels marked as Manually integrated", fullDis:"Channels marked as Manually integrated", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:97, shortDis:"Channels integrated using Smoothening and/ or T...", fullDis:"Channels integrated using Smoothening and/ or Time offset parameters", type:"PAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:98, shortDis:"Others If Any", fullDis:"Others If Any", type:"PAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:99, shortDis:"Project Integrity Failed", fullDis:"Project Integrity Failed", type:"SAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"True", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:100, shortDis:"Sample Set Finished Date incomplete", fullDis:"Sample Set Finished Date incomplete", type:"PAT", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:101, shortDis:"Altered Sample Set", fullDis:"Altered Sample Set", type:"SATR", stage:"Medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:102, shortDis:"Renamed Sample Set", fullDis:"Renamed Sample Set", type:"SATR", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:103, shortDis:"Unlocked Channels Of Sample Set", fullDis:"Unlocked Channels Of Sample Set", type:"SATR", stage:"Medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:104, shortDis:"Sample set channels processed within 48 hours", fullDis:"Sample set channels processed within 48 hours", type:"SATR", stage:"Medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:105, shortDis:"Aborted Sample Set", fullDis:"Aborted Sample Set", type:"SATR", stage:"Medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:106, shortDis:"Reprocessed Results", fullDis:"Reprocessed Results", type:"SATR", stage:"Medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:107, shortDis:"Column heater door open", fullDis:"Column heater door open", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:108, shortDis:"Column temp over limit", fullDis:"Column temp over limit", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:109, shortDis:"Missing Vial", fullDis:"Missing Vial", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:110, shortDis:"Ethernet cable disconnected", fullDis:"Ethernet cable disconnected", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:111, shortDis:"Lamp hours counter exceeded", fullDis:"Lamp hours counter exceeded", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:112, shortDis:"Lost Prime", fullDis:"Lost Prime", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:113, shortDis:"Low column temp", fullDis:"Low column temp", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:114, shortDis:"Low sample temp", fullDis:"Low sample temp", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:115, shortDis:"Sample temperature over limit", fullDis:"Sample temperature over limit", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:116, shortDis:"Sequence stopped because of error", fullDis:"Sequence stopped because of error", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:117, shortDis:"Sequence stopped by user", fullDis:"Sequence stopped by user", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:118, shortDis:"System Over Pressure", fullDis:"System Over Pressure", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:119, shortDis:"The Power to the instrument was turned OFF duri...", fullDis:"The Power to the instrument was turned OFF during analysis", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:120, shortDis:"Communication failure", fullDis:"Communication failure", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:121, shortDis:"Data file check sum error", fullDis:"Data file check sum error", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:122, shortDis:"Instrument Failure", fullDis:"Instrument Failure", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:123, shortDis:"Stop Flow key was pressed", fullDis:"Stop Flow key was pressed", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:124, shortDis:"User Abort", fullDis:"User Abort", type:"PAT", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:125, shortDis:"No of injections and results", fullDis:"No of injections and results", type:"SATR", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] }
];

const EMPTY_FORM = { shortDis:"", fullDis:"", type:"", stage:"Initial", status:"Active" };

const ChecklistConfig = ({ onStatsChange }) => {
  const [rows,             setRows]            = useState(INITIAL_ROWS);
  const [showAddModal,     setShowAddModal]    = useState(false);
  const [addForm,          setAddForm]         = useState(EMPTY_FORM);
  const [addErrors,        setAddErrors]       = useState({});
  const [isFilterMode,     setIsFilterMode]    = useState(false);
  const [isEnabled,        setIsEnabled]       = useState(true);
  const [severityFilter,   setSeverityFilter]  = useState("All");
  const [search,           setSearch]          = useState("");
  const [page,             setPage]            = useState(1);
  const [pageSize,         setPageSize]        = useState(5);
  const [showHistory,      setShowHistory]     = useState(false);
  const [showEditDialog,   setShowEditDialog]  = useState(false);
  const [historyFilter,    setHistoryFilter]   = useState("Signed");
  const [selectedRow,      setSelectedRow]     = useState(null);
  const [isDialogEditable, setIsDialogEditable]= useState(false);
  const [isDirty,          setIsDirty]         = useState(false);

  /* ── Push stats up to Empower header whenever rows change ── */
  useEffect(() => {
    if (!onStatsChange) return;
    onStatsChange([
      { label:"High",     value: rows.filter(r => (r.stage||"").toLowerCase() === "high").length,   cls:"empower-stat__val--danger"  },
      { label:"Medium",   value: rows.filter(r => (r.stage||"").toLowerCase() === "medium").length, cls:"empower-stat__val--warn"    },
      { label:"Low",      value: rows.filter(r => (r.stage||"").toLowerCase() === "low").length,    cls:"empower-stat__val--info"    },
      { label:"CDS",      value: rows.filter(r => (r.system||"").toUpperCase() === "CDS").length,   cls:""                           },
      { label:"Non-CDS",  value: rows.filter(r => (r.system||"").toUpperCase() !== "CDS").length,   cls:""                           },
      { label:"Active",   value: rows.filter(r => r.status === "Active").length,                    cls:"empower-stat__val--success" },
      { label:"Inactive", value: rows.filter(r => r.status === "Inactive").length,                  cls:"empower-stat__val--muted"   },
    ]);
  }, [rows, onStatsChange]);

  /* ── Filtering ── */
  const statusFiltered = !isFilterMode
    ? rows
    : rows.filter(r => r.status === (isEnabled ? "Active" : "Inactive"));

  const severityFiltered = severityFilter === "All"
    ? statusFiltered
    : statusFiltered.filter(r =>
        (r.stage || "").toLowerCase() === severityFilter.toLowerCase()
      );

  const filteredRows = search.trim() === ""
    ? severityFiltered
    : severityFiltered.filter(r => {
        const q = search.toLowerCase();
        return (
          String(r.id).includes(q)                                ||
          (r.shortDis         || "").toLowerCase().includes(q)    ||
          (r.fullDis          || "").toLowerCase().includes(q)    ||
          (r.type             || "").toLowerCase().includes(q)    ||
          (r.stage            || "").toLowerCase().includes(q)    ||
          (r.status           || "").toLowerCase().includes(q)    ||
          (r.system           || "").toLowerCase().includes(q)    ||
          (r.module           || "").toLowerCase().includes(q)    ||
          (r.digital          || "").toLowerCase().includes(q)    ||
          (r.isFromAuditTrail || "").toLowerCase().includes(q)    ||
          (r.generationType   || "").toLowerCase().includes(q)
        );
      });

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const pagedRows  = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  function goPage(p) { setPage(Math.max(1, Math.min(totalPages, p))); }
  function resetPage() { setPage(1); }

  function pagePills() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pills = new Set([1, 2, 3]);
    if (safePage > 4) pills.add('..a');
    for (let i = Math.max(4, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pills.add(i);
    if (safePage < totalPages - 3) pills.add('..b');
    pills.add(totalPages - 1);
    pills.add(totalPages);
    return [...pills];
  }

  function openAddModal() { setAddForm(EMPTY_FORM); setAddErrors({}); setShowAddModal(true); }
  function closeAddModal() { setShowAddModal(false); setAddErrors({}); }
  function handleAddField(key, val) {
    setAddForm(prev => ({ ...prev, [key]: val }));
    setAddErrors(prev => ({ ...prev, [key]: '' }));
  }
  function handleAddSubmit() {
    const errs = {};
    if (!addForm.shortDis.trim()) errs.shortDis = "Required";
    if (!addForm.fullDis.trim())  errs.fullDis  = "Required";
    if (!addForm.type.trim())     errs.type     = "Required";
    if (Object.keys(errs).length) { setAddErrors(errs); return; }
    setRows(prev => [{
      id: Date.now(), ...addForm,
      history: [{ version:"v1.0", action:"Created", user:"Current User",
        date: new Date().toLocaleString(), reason:`${addForm.shortDis} added`, status:"Signed" }],
    }, ...prev]);
    setPage(1);
    setShowAddModal(false);
  }

  const handleDialogSave = () => {
    const entry = {
      version: `v${(selectedRow.history?.length || 0) + 1}.0`,
      action:"Updated", user:"Current User",
      date: new Date().toLocaleString(), reason:"Row details modified", status:"Signed",
    };
    const updated = { ...selectedRow, history: [...(selectedRow.history || []), entry] };
    setRows(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedRow(updated);
    setIsDialogEditable(false); setIsDirty(false); setShowEditDialog(false);
  };
  const openEdit = (row) => {
    setSelectedRow({ ...row }); setIsDialogEditable(false); setIsDirty(false); setShowEditDialog(true);
  };
  const openHistory = (row) => {
    setSelectedRow(row); setHistoryFilter("Signed"); setShowHistory(true);
  };
  const filteredHistory = selectedRow?.history?.filter(h => h.status === historyFilter) || [];

  return (
    <div className="clc">
      <div className="clc__scroll-wrap">
      <div className="clc__card">

        <div className="clc__card-header">
          <div>
            <h3 className="clc__card-title">Checklist - CDS</h3>
            <p className="clc__card-sub">Create and manage GxP checklists</p>
          </div>
          <div className="clc__actions">
            <select className="clc__select" value={severityFilter}
              onChange={e => { setSeverityFilter(e.target.value); resetPage(); }}>
              <option value="All">All Severity</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <div className="clc__search-wrap">
              <i className="fa-solid fa-magnifying-glass clc__search-icon" />
              <input className="clc__search" placeholder="Search all columns..."
                value={search} onChange={e => { setSearch(e.target.value); resetPage(); }} />
              {search && <i className="fa-solid fa-xmark clc__search-clear"
                onClick={() => { setSearch(''); resetPage(); }} />}
            </div>
            <button className="clc__add-btn" onClick={openAddModal}>+ Add</button>
          </div>
        </div>

        <div className="clc__table-wrap">
          <table className="clc__table">
            <thead>
              <tr>
                <th>SI.No</th>
                <th>Check point Name</th>
                <th>Status</th>
                <th>System</th>
                <th>Module</th>
                <th>Type</th>
                <th>Digital</th>
                <th>IS From Audit Trail</th>
                <th>Generation_Type</th>
                <th>Sevearity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row, idx) => (
                <tr key={row.id} className={idx === 0 && page === 1 && rows[0]?.id === row.id ? "clc__row--new" : ""}>
                  <td>{(safePage - 1) * pageSize + idx + 1}</td>
                  <td>{row.shortDis}</td>
                  <td>
                    <span className={`clc__status ${row.status === "Active" ? "clc__status--active" : "clc__status--inactive"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>{row.system}</td>
                  <td>{row.module}</td>
                  <td>{row.type}</td>
                  <td>{row.digital}</td>
                  <td>{row.isFromAuditTrail}</td>
                  <td>{row.generationType || "-"}</td>
                  <td>
                    <span className={`clc__stage-badge clc__stage-badge--${(row.stage||"-").toLowerCase()}`}>
                      {row.stage}
                    </span>
                  </td>
                  <td>
                    <div className="clc__row-actions">
                      <i className="fa-solid fa-clock-rotate-left" title="History" onClick={() => openHistory(row)} />
                      <i className="fa-solid fa-pen" title="Edit" onClick={() => openEdit(row)} />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={11} className="clc__empty-row">No records match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="clc__pagination">
          <div className="clc__pg-left">
            <select className="clc__page-size"
              value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); resetPage(); }}>
              {PAGE_SIZES.map(n => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>
          <div className="clc__pg-center">
            <button className="clc__pg-nav" onClick={() => goPage(safePage - 1)} disabled={safePage === 1}>
              ← Previous
            </button>
            <div className="clc__pg-pills">
              {pagePills().map((p) =>
                typeof p === 'string'
                  ? <span key={p} className="clc__pg-dot">…</span>
                  : <button key={p}
                      className={`clc__pg-pill ${safePage === p ? 'clc__pg-pill--active' : ''}`}
                      onClick={() => goPage(p)}>{p}</button>
              )}
            </div>
            <button className="clc__pg-nav" onClick={() => goPage(safePage + 1)} disabled={safePage === totalPages}>
              Next →
            </button>
          </div>
          <div className="clc__pg-right">
            <span className="clc__pg-info">
              {filteredRows.length === 0
                ? '0 records'
                : `${(safePage-1)*pageSize+1}–${Math.min(safePage*pageSize, filteredRows.length)} of ${filteredRows.length}`}
            </span>
          </div>
        </div>

      </div>
      </div>

      {showAddModal && createPortal(
        <div className="clc__modal-backdrop" onClick={closeAddModal}>
          <div className="clc__modal" onClick={e => e.stopPropagation()}>
            <div className="clc__modal-header">
              <h3>Add New Checklist</h3>
              <i className="fa-solid fa-xmark" onClick={closeAddModal} />
            </div>
            <div className="clc__modal-body">
              <div className="clc__modal-field">
                <label>Short Description <span className="clc__required">*</span></label>
                <input className={`clc__modal-input ${addErrors.shortDis ? "clc__modal-input--error" : ""}`}
                  placeholder="Enter short description" value={addForm.shortDis}
                  onChange={e => handleAddField("shortDis", e.target.value)} />
                {addErrors.shortDis && <span className="clc__field-error">{addErrors.shortDis}</span>}
              </div>
              <div className="clc__modal-field">
                <label>Full Description <span className="clc__required">*</span></label>
                <input className={`clc__modal-input ${addErrors.fullDis ? "clc__modal-input--error" : ""}`}
                  placeholder="Enter full description" value={addForm.fullDis}
                  onChange={e => handleAddField("fullDis", e.target.value)} />
                {addErrors.fullDis && <span className="clc__field-error">{addErrors.fullDis}</span>}
              </div>
              <div className="clc__modal-field">
                <label>Type <span className="clc__required">*</span></label>
                <input className={`clc__modal-input ${addErrors.type ? "clc__modal-input--error" : ""}`}
                  placeholder="e.g. GxP, Non-GxP" value={addForm.type}
                  onChange={e => handleAddField("type", e.target.value)} />
                {addErrors.type && <span className="clc__field-error">{addErrors.type}</span>}
              </div>
              <div className="clc__modal-field">
                <label>Stage</label>
                <select className="clc__modal-select" value={addForm.stage}
                  onChange={e => handleAddField("stage", e.target.value)}>
                  {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="clc__modal-footer">
              <button className="clc__modal-btn clc__modal-btn--cancel" onClick={closeAddModal}>Cancel</button>
              <button className="clc__modal-btn clc__modal-btn--submit" onClick={handleAddSubmit}>Submit</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showEditDialog && selectedRow && createPortal(
        <div className="clc__overlay" onClick={() => setShowEditDialog(false)}>
          <div className="clc__dialog" onClick={e => e.stopPropagation()}>
            <div className="clc__dialog-header">
              <h3>Host Name</h3>
              <i className="fa-solid fa-xmark" onClick={() => setShowEditDialog(false)} />
            </div>
            <div className="clc__section">
              <div className="clc__section-header">
                <h4>Connection</h4>
                <div className="clc__section-actions">
                  <button className="clc__btn clc__btn--edit" onClick={() => { setIsDialogEditable(true); setIsDirty(false); }}>Edit</button>
                  <button className="clc__btn clc__btn--save" disabled={!isDirty || !isDialogEditable} onClick={handleDialogSave}>Save</button>
                </div>
              </div>
              <div className="clc__field">
                <label>Empower Data Source</label>
                <input value={selectedRow.shortDis} disabled={!isDialogEditable}
                  onChange={e => { setSelectedRow({...selectedRow, shortDis: e.target.value}); setIsDirty(true); }} />
              </div>
              <div className="clc__field">
                <label>Empower User Name</label>
                <input value={selectedRow.fullDis} disabled={!isDialogEditable}
                  onChange={e => { setSelectedRow({...selectedRow, fullDis: e.target.value}); setIsDirty(true); }} />
              </div>
              <div className="clc__field">
                <label>Empower Password</label>
                <input type="password" value={selectedRow.type} disabled={!isDialogEditable}
                  onChange={e => { setSelectedRow({...selectedRow, type: e.target.value}); setIsDirty(true); }} />
              </div>
            </div>
            <div className="clc__section">
              <h4>Project Mapping</h4>
              <div className="clc__field">
                <label>Project Name</label>
                <input value={selectedRow.stage} disabled={!isDialogEditable}
                  onChange={e => { setSelectedRow({...selectedRow, stage: e.target.value}); setIsDirty(true); }} />
              </div>
              <div className="clc__field">
                <label>Location</label>
                <input value={selectedRow.status} disabled={!isDialogEditable}
                  onChange={e => { setSelectedRow({...selectedRow, status: e.target.value}); setIsDirty(true); }} />
              </div>
            </div>
            <div className="clc__section">
              <h4>System Info</h4>
              <div className="clc__field"><label>Location</label><input value="Germany" disabled /></div>
              <div className="clc__field"><label>Login Date-Time</label><input value="April 24, 2024 14:45" disabled /></div>
            </div>
            <div className="clc__dialog-footer">
              <button className="clc__btn clc__btn--test">Test Connection</button>
              <button className="clc__btn clc__btn--edit" onClick={() => setShowEditDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showHistory && createPortal(
        <div className="clc__overlay" onClick={() => setShowHistory(false)}>
          <div className="clc__history" onClick={e => e.stopPropagation()}>
            <div className="clc__dialog-header">
              <h3>History</h3>
              <i className="fa-solid fa-xmark" onClick={() => setShowHistory(false)} />
            </div>
            <p className="clc__history-sub">Audit trail for: {selectedRow?.shortDis}</p>
            <div className="clc__filters">
              {["Signed","Rejected","Pending"].map(f => (
                <button key={f} className={`clc__filter-btn ${historyFilter === f ? "clc__filter-btn--active" : ""}`}
                  onClick={() => setHistoryFilter(f)}>{f}</button>
              ))}
            </div>
            <div className="clc__history-list">
              {filteredHistory.length === 0
                ? <div className="clc__empty-row" style={{textAlign:"center",padding:"30px"}}>No {historyFilter} records found.</div>
                : filteredHistory.map((h, i) => (
                  <div key={i} className="clc__history-card">
                    <div className="clc__history-badge">{h.version}</div>
                    <div className="clc__history-content">
                      <div className="clc__history-title">{h.action}</div>
                      <div className="clc__history-meta"><span>{h.user}</span><span>{h.date}</span></div>
                      <div className="clc__history-reason">{h.reason}</div>
                    </div>
                    <div className={`clc__history-status clc__history-status--${h.status.toLowerCase()}`}>{h.status}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default ChecklistConfig;