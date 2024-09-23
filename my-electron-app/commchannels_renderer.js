// ****************************************
//
// Communication Channel endpoints
//
// ****************************************
async function commChannelTemplate(e) {
    switch (e.target.id) {
        case 'check-commchannel':
            checkComm(e);
            break;
        case 'unconfirm-commchannels':
            unconfirmed(e);
            break;
        case 'download-conversations-csv':
            downloadConvos(e);
            break;
        case 'gc-between-users':
            getConvos(e);
            break;
        default:
            break;
    }
}

function checkComm(e) {

    // const eHeader = document.createElement('div');
    // eHeader.innerHTML = `<h3>${e.target.id}</h3>`;
    const eContent = document.querySelector('#endpoint-content');
    // eContent.append(eHeader);
    eContent.innerHTML = `
        <div>
            <h3>Check suppression and bounce list</h3>
        </div>
    `;

    const eForm = document.createElement('form');
    eForm.innerHTML = `
            <div class="row">
                <div class="mb-3">
                    <div class="col-auto">
                        <label for="region" class="form-label">Region: </label>
                    </div>
                    <div class="col-2">
                        <select id="region" class="form-select" aria-label="Region info">
                            <option value="iad_pdx" selected>IAD/PDX</option>
                            <option value="dub_fra">DUB/FRA</option>
                            <option value="syd_sin">SYD/SIN</option>
                            <option value="yul" selected>YUL</option>
                        </select>
                    </div>
                </div>
                <div id="email-options">
                    <div class="form-check form-switch">
                        <label class="form-label" for="single-email-chkbx">Single Email</label>
                        <input id="single-email-chkbx" type="checkbox" class="form-check-input" role="switch">
                    </div>
                    <div class="form-check form-switch">
                        <label class="form-label" for="domain-email-chkbx">Domain</label>
                        <input id="domain-email-chkbx" type="checkbox" class="form-check-input" role="switch">
                    </div>
                </div>
                <div class="">
                    <div class="col-auto">
                        <label id="email-label" for="email" class="form-label">Email</label>
                    </div>
                    <div class="w-100"></div>
                    <div class="col-5">
                        <input disabled type="text" id="email" class="form-control" aria-describedby="email-form-text">
                    </div>
                    <div class="form-text" id="email-form-text">
                        Enter the full email address you want to check
                    </div>
                </div>
            </div>
        <button type="button" class="btn btn-primary mt-3" id="email-check" disabled>Check</button>
        <div id="progress-div" hidden>
            <div id="loading-wheel">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
        <div id="response-container" class="mt-5">
        </div>
        `

    eContent.append(eForm);

    const emailInput = eContent.querySelector('#email');
    emailInput.addEventListener('input', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.target.value === '') {
            checkBtn.disabled = true;
        } else {
            checkBtn.disabled = false;
        }
    })

    function handleQueryType(e) {

        const formMessgae = eContent.querySelector('#email-form-text')
        const emailLabel = eContent.querySelector('#email-label')
        const emailChbx = eContent.querySelector('#single-email-chkbx');
        const domainChbx = eContent.querySelector('#domain-email-chkbx');

        if (emailChbx.checked === false && domainChbx.checked === false) {
            emailInput.value = '';
            emailInput.disabled = true;
            checkBtn.disabled = true;
        } else {
            if (e.target.id === 'single-email-chkbx') {
                eContent.querySelector('#domain-email-chkbx').checked = false;
                formMessgae.innerHTML = "Enter the full email address you want to check";
                emailLabel.innerHTML = "Email";
            } else {
                eContent.querySelector('#single-email-chkbx').checked = false;
                formMessgae.innerHTML = "Enter the domain pattern you want to check. You can use a wildcard at the beginning and end, for example *student* will match anything that has student in the email. <p><p>NOTE: This queries the entire aws region and will take some time, we're talking hours in some cases.</p></p>";
                emailLabel.innerHTML = "Domain";
            }
            emailInput.disabled = false;
            if (emailInput.value !== '') {
                checkBtn.disabled = false;
            }
        }
    }

    const emailOptions = eContent.querySelector('#email-options');
    emailOptions.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        handleQueryType(e);
    })

    const checkBtn = eContent.querySelector('button');
    checkBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        checkBtn.disabled = true;

        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const region = eContent.querySelector('#region').value;
        const email = eContent.querySelector('#email').value.trim();
        const responseContainer = eContent.querySelector('#response-container');
        const progresDiv = eContent.querySelector('#progress-div');
        const progressBar = eContent.querySelector('.progress-bar');
        const progressInfo = eContent.querySelector('#progress-info');

        responseContainer.innerHTML = '';

        const options = eContent.querySelectorAll('input[type="checkbox"]');
        const checkedOption = Array.from(options).find(checkbox => checkbox.checked);
        const option = checkedOption ? checkedOption.id.split('-')[0] : undefined;

        const data = {
            domain: domain,
            token: apiToken,
            region: region,
            pattern: email
        }

        let response;
        let hasError = false;
        if (option === 'single') {
            try {
                responseContainer.innerHTML = 'Checking email....';
                progresDiv.hidden = false;
                response = await window.axios.checkCommChannel(data);
            } catch (error) {
                hasError = true;
                errorHandler(error, responseContainer);
            } finally {
                checkBtn.disabled = false;
                responseContainer.innerHTML += '<p>Done.</p>';
                progresDiv.hidden = true;
            }

            if (!hasError) {
                responseContainer.innerHTML += `<p>Suppressed: <span style="color: ${response.suppressed ? 'red' : 'green'}">${response.suppressed ? 'Yes' : 'No'}</span></p>`;
                responseContainer.innerHTML += `<p>Bounced: <span style="color: ${response.bounced ? 'red' : 'green'}">${response.bounced ? 'Yes' : 'No'}</span></p>`;
            }
        } else {
            progresDiv.hidden = false;
            // progressBar.style.width = '0%';
            // let progress = 0;
            try {
                responseContainer.innerHTML = 'Checking domain pattern....';
                response = await window.axios.checkCommDomain(data);
                responseContainer.innerHTML += 'Done.';
            } catch (error) {
                errorHandler(error, responseContainer);
            } finally {
                checkBtn.disabled = false;
                progresDiv.hidden = true;
            }

            if (response) {
                responseContainer.innerHTML += `<p>Found suppressed email. Download them here: <button id="download-emails">Download Emails</button>.</p>`;
                const downloadEmails = responseContainer.querySelector('#download-emails');
                downloadEmails.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    window.csv.sendToText();
                });
            } else {
                responseContainer.innerHTML += `<p>Didn't find any emails matching the specified pattern.</p>`;
            }
        }
    });
}

function unconfirmed(e) {
    const eContent = document.querySelector('#endpoint-content');
    // eContent.append(eHeader);
    eContent.innerHTML = `
        <div>
            <h3>Unconfirmed emails</h3>
        </div>
    `;

    const eForm = document.createElement('form');
    eForm.innerHTML = `
        <div id="switches">
            <div class="form-check form-switch">
                <label class="form-check-label" for="uncofirmed-email-switch">Check for unconfirmed emails</label>
                <input class="form-check-input" type="checkbox" role="switch" id="unconfirmed-email-switch">
                <div id="email-pattern-div" hidden>
                    <input id="unconfirmed-email-pattern" type="text" class="form-control" placeholder="email.domain.edu" aria-describedby="unconfirmed-pattern-description">
                    <div id="email-warning" style="color: red;" class="form-text" hidden>***Must enter a pattern***</div>
                    <span id="unconfirmed-pattern-description" class="form-text">Email domain pattern to search for unconfirmed emails (wildcards accepted *pattern*edu)</span>
                </div>
            </div>
            <div class="form-check form-switch">
                <label class="form-check-label" for="confirm-email-switch">Upload file of emails to confirm</label>
                <input class="form-check-input" type="checkbox" role="switch" id="upload-email-switch" aria-describedby="confirm-file-description">
                <div id="confirm-file-description" class="form-text" hidden>Must be a simple text file only containing a list of emails. Emails may be comma separated or on individual lines</div>
            </div>
            <div class="form-check form-switch">
                <label class="form-check-label" for="confirm-email-list-switch">Input list of emails</label>
                <input class="form-check-input" type="checkbox" role="switch" id="confirm-email-list-switch" aria-describedby="confirm-email-list-desc">
                <div id="confirm-email-list-box" hidden>
                    <textarea class="form-control" id="email-list-box" rows="3" placeholder="example1@example.com,example2@example.com, etc."></textarea>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary mt-3" id="unconfirmed-check-btn" disabled>Check</button>
        <button type="button" class="btn btn-primary mt-3" id="upload-email-btn" hidden disabled>Upload</button>
        <button type="button" class="btn btn-primary mt-3" id="confirm-email-btn" hidden disabled>Confirm</button>

        <div hidden id="progress-div">
            <p id="progress-info"></p>
            <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
        </div>
        <div id="response-container" class="mt-5">
            <div id="loading-wheel" hidden>
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div id="response"></div>
        </div>
        `
    eContent.append(eForm);

    const switchListener = eContent.querySelector('#switches');
    switchListener.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('inside switchListerner');
        console.log('the target', e.target);
        if (e.target.id === "unconfirmed-email-pattern") {
            return;
        }

        handleSwitches(e);
    })

    function handleSwitches(e) {
        const inputs = switchListener.querySelectorAll('input');
        const patternDiv = eContent.querySelector('#email-pattern-div');
        const fileSpan = eContent.querySelector('#confirm-file-description');
        const confirmDiv = eContent.querySelector('#confirm-email-list-box')
        // disable all other inputs inputs
        for (let input of inputs) {
            if (input.id !== e.target.id) {
                input.checked = false;
            }
        }

        // showing the correct button
        if (e.target.checked === false) {
            unconfirmBtn.disabled = true;
            confirmBtn.disabled = true;
            uploadBtn.disabled = true;
        } else if (e.target.id.includes('unconfirm')) {
            unconfirmBtn.hidden = false;
            unconfirmBtn.disabled = false;
            patternDiv.hidden = false;
            confirmBtn.hidden = true;
            confirmBtn.disabled = true;
            confirmDiv.hidden = true;
            uploadBtn.hidden = true;
            uploadBtn.disabled = true;
            fileSpan.hidden = true;
        } else if (e.target.id.includes('upload')) {
            unconfirmBtn.hidden = true;
            unconfirmBtn.disabled = true;
            patternDiv.hidden = true;
            confirmBtn.hidden = true;
            confirmBtn.disabled = true;
            confirmDiv.hidden = true;
            uploadBtn.disabled = false;
            uploadBtn.hidden = false;
            fileSpan.hidden = false;
        } else {
            unconfirmBtn.hidden = true;
            unconfirmBtn.disabled = true;
            patternDiv.hidden = true;
            confirmBtn.hidden = false;
            confirmBtn.disabled = false;
            confirmDiv.hidden = false;
            uploadBtn.disabled = true;
            uploadBtn.hidden = true;
            fileSpan.hidden = true;
        }
    }


    const unconfirmBtn = eContent.querySelector('#unconfirmed-check-btn');
    const uploadBtn = eContent.querySelector('#upload-email-btn');
    const confirmBtn = eContent.querySelector('#confirm-email-btn');
    unconfirmBtn.addEventListener('click', handleUnconfirmedCheck);
    confirmBtn.addEventListener('click', handleConfirmCheck);
    uploadBtn.addEventListener('click', handleUploadCheck);

    async function handleUnconfirmedCheck(e) {
        e.preventDefault();
        e.stopPropagation();
        unconfirmBtn.disabled = true;

        console.log('Inside handleUnonfirmedCheck');
        const domain = document.querySelector('#domain').value.trim();
        const token = document.querySelector('#token').value.trim();
        const emailPatternInput = eContent.querySelector('#unconfirmed-email-pattern');
        const emailPattern = emailPatternInput.value.trim();
        const emailWarning = eContent.querySelector('#email-warning');
        const progresDiv = eContent.querySelector('#progress-div');
        const responseContainer = eContent.querySelector('#response-container');
        const responseDetails = responseContainer.querySelector('#response');

        if (emailPattern.length < 1) {
            emailWarning.hidden = false;
            emailPatternInput.focus();
            unconfirmBtn.disabled = false;
            return;
        } else {
            emailWarning.hidden = true;
        }

        const requestData = {
            domain: domain,
            token: token,
            pattern: emailPattern
        };

        try {
            // progresDiv.hidden = false;
            responseContainer.querySelector('div').hidden = false; // showing the spinning wheel
            const response = await window.axios.checkUnconfirmedEmails(requestData)
            responseContainer.querySelector('div').hidden = true;
            responseDetails.innerHTML = 'List of unconfirmed emails saved.';
        } catch (error) {
            console.log('There was an error', error);
            responseContainer.querySelector('div').hidden = true;
            errorHandler(error, responseDetails);
        } finally {
            unconfirmBtn.disabled = false;
            progresDiv.hidden = true;
        }
    }

    async function handleUploadCheck(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadBtn.disabled = true;

        const domain = document.querySelector('#domain').value.trim();
        const token = document.querySelector('#token').value.trim();
        const progresDiv = eContent.querySelector('#progress-div');
        const progressBar = eContent.querySelector('.progress-bar');
        const progressInfo = eContent.querySelector('#progress-info');

        progressInfo.innerHTML = '';

        const requestData = {
            domain: domain,
            token: token
        }

        progresDiv.hidden = false;
        window.progressAPI.onUpdateProgress((progress) => {
            progressBar.style.width = `${progress}%`;
        });

        let totalEmails = 0;
        window.dataUpdate.onUpdate((data) => {
            totalEmails = data;
        });
        try {
            const result = await window.fileUpload.confirmEmails(requestData);
            progressInfo.innerHTML += `<h5>Results:</h5><p class="mb-1">Processed:  ${totalEmails}</p>`;
            progressInfo.innerHTML += `<p class="mb-1">Confirmed: ${result.confirmed} <div class="form-text">NOTE: Number of emails confirmed may be different than the number processed if the email didn't need to be confirmed</div></p>`;
            if (result.failed.length > 0) {
                progressBar.parentElement.hidden = true;
                progressInfo.innerHTML += `Failed to confirm ${result.failed.length} emails`;
                errorHandler({ message: `${result.failed[0].reason}` }, progressInfo);
            }
        } catch (error) {
            errorHandler(error, progressInfo);
        } finally {
            uploadBtn.disabled = false;
        }

    }

    async function handleConfirmCheck(e) {
        e.preventDefault();
        e.stopPropagation();
        confirmBtn.disabled = true;

        const domain = document.querySelector('#domain').value.trim();
        const token = document.querySelector('#token').value.trim();
        const progresDiv = eContent.querySelector('#progress-div');
        const progressBar = eContent.querySelector('.progress-bar');
        const progressInfo = eContent.querySelector('#progress-info');
        const emailBox = eContent.querySelector('#email-list-box').value;
        const emails = emailBox.split(/\r?\n|\n|\,/)
            .map((email) => email.trim());

        progressInfo.innerHTML = '';

        const requestData = {
            domain: domain,
            token: token,
            emails: emails
        }

        progresDiv.hidden = false;
        window.progressAPI.onUpdateProgress((progress) => {
            progressBar.style.width = `${progress}%`;
        });

        try {
            const result = await window.axios.confirmEmails(requestData);
            progressInfo.innerHTML += `<h5>Results:</h5><p class="mb-1">Processed:  ${requestData.emails.length}</p>`;
            progressInfo.innerHTML += `<p class="mb-1">Confirmed: ${result.confirmed} <div class="form-text">NOTE: Number of emails confirmed may be different than the number processed if the email didn't need to be confirmed</div></p>`;
            if (result.failed.length > 0) {
                progressBar.parentElement.hidden = true;
                progressInfo.innerHTML += `Failed to confirm ${result.failed.length} emails`;
                errorHandler({ message: `${result.failed[0].reason}` }, progressInfo);
            }
        } catch (error) {
            errorHandler(error, progressInfo);
        } finally {
            confirmBtn.disabled = false;
        }

    }
}