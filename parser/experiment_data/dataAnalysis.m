% dataAnalysis.m

%% import from doublet.csv
%[subInd, trialType, RT, rating, im1, im2] = importData('doublet.csv');
load oldWorkspace; 

%% Step 1: plot a histgram of 1-9 rating distribution
testInd = trialType~=3; 
effectRating = rating(testInd);
temp = zeros(9,1);
for curItr = 1 : 9
    temp(curItr) = sum(effectRating==curItr);
    disp(temp(curItr));
end
figure(1);
a = bar(temp);
title('Rating Distribution across 9 subjects');
xlabel('Similarity Rating');
ylabel('# of times');
saveas(gcf, 'RatingDistribution.png');

%% Step 2: plot a histgram of RT times. 
figure(2);
RT = RT/1000;
hist(RT, 500);
title('RT distribution');
xlabel('Reaction Time per trial (sec)');
ylabel('Num');
axis([0,60,0,140]);
saveas(gcf, 'RT distributions.png');

%% Step 3: plot intersubject std
intergratedData = [trialType, subInd, im1, im2, rating, RT/1000];
intergratedData = intergratedData(testInd, :);

% prepare sub2ind
feFaceNum = 1000;
linearInd = sub2ind([feFaceNum, feFaceNum], intergratedData(:,3), intergratedData(:,4));

uniquePair = unique(linearInd);
pairNum = length(uniquePair);
interStatArray = zeros(pairNum, 5);%repetitiveTimes, average rating, averageRT, rating variance, RT variance. 
for curPair = 1 : length(uniquePair)
    tempInd = linearInd==uniquePair(curPair);
    interStatArray(curPair, 1) = sum(tempInd);
    interStatArray(curPair, 2) = mean(intergratedData(tempInd, 5));%average rating
    interStatArray(curPair, 3) = mean(intergratedData(tempInd, 6));%average RT
    interStatArray(curPair, 4) = std(intergratedData(tempInd, 5));%std of rating
    interStatArray(curPair, 5) = std(intergratedData(tempInd, 6));%std of RT
end

figure(3);
subplot(2,2,1);
hist(interStatArray(:,2),100);%average Rating
title('average rating');
subplot(2,2,2);
hist(interStatArray(:,3),100);%average RT
title('average RT');
subplot(2,2,3);
hist(interStatArray(:,4),100);%std rating
title('std rating');
subplot(2,2,4);
hist(interStatArray(:,5),100);%std rating
title('std RT');
saveas(gcf, 'intersubjectVariance.png');

% % prepare subData.
% subNum = max(subInd);
% 
% for curItr = 1 %: subNum
%     curInd = (subInd == curItr); 
%     tempData = intergratedData(curInd, :);
%     tempLinearInd = linearInd(curInd);
%     [sortedLinearTemp, sortedInd] = sort(tempLinearInd);
%     sortedTempData = tempData(sortedInd, :);
% end









